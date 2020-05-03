import {
  format,
  setMinutes,
  addHours,
  setSeconds,
  differenceInSeconds,
  subDays,
  addDays
} from 'date-fns';
import { bus } from '@/utils/eventhandler';
import axios from 'axios';

export default {
  url: process.env.VUE_APP_HOSTURL,
  currentHour: '',
  nextHour: '',
  todayCountArray: [],
  twoDaysCountArray: [],
  machineList: [],
  machineStatusArray: [],
  machineOEEStatusArray: [],
  machineStatusObject: {
    mcID: '',
    mcName: '',
    runTime: '',
    idleTime: '',
    downTime: ''
  },
  getMachineList: async function() {
    this.machineList = [];

    let api = 'api/GetMachineInfo';
    let uri = [this.url, api].join('/');
    //console.log('TCL: uri', uri);
    let response = await axios.get(uri);
    let objects = JSON.parse(JSON.stringify(response.data));
    objects.forEach(element => {
      this.machineList.push(element.ID);
    });
  },
  getCurrentTime() {
    this.currentHour = new Date();
    this.currentHour = setMinutes(this.currentHour, 1).setSeconds(0);
    this.nextHour = addHours(this.currentHour, 1).setMinutes(0);
    this.currentHour = format(new Date(this.currentHour), 'HH:mm:ss');
    this.nextHour = format(new Date(this.nextHour), 'HH:mm:ss');
  },
  getDateInfo() {
    let currentDate = new Date();
    let prevDate = subDays(currentDate, 1);
    let nextDate = addDays(currentDate, 1);
    return {
      currentDate: format(currentDate, 'yyyy-MM-dd'),
      prevDate: format(prevDate, 'yyyy-MM-dd'),
      nextDate: format(nextDate, 'yyyy-MM-dd')
    };
  },
  getUPH: async function() {
    //console.log('TCL: getUPH');
    let api = 'api/GetUPH';
    let uri = [this.url, api].join('/');
    console.log('TCL: uri', uri);
    let response = await axios.get(uri);
    console.log('TCL: response', response.data);
    this.parseUPH(response.data);
  },
  parseUPH(uphArray) {
    let uphData = [];
    let uphLabels = [];
    let objects = JSON.parse(JSON.stringify(uphArray));
    objects.forEach(element => {
      if (element.Count === 1) {
        uphData.push(0);
      } else {
        uphData.push(element.Count);
      }
      uphLabels.push(element.MachineName);
    });
    this.getCurrentTime();
    bus.$emit('RenderUPHChart', {
      labels: uphLabels,
      series: uphData,
      currHour: this.currentHour,
      nextHour: this.nextHour
    });
    this.getTodayCount();
  },
  getTodayCount: async function() {
    this.todayCountArray = [];
    let dateInfo = this.getDateInfo();
    let api = 'api/GetFullDay';
    let uri = [this.url, api, dateInfo.currentDate, dateInfo.currentDate].join(
      '/'
    );
    //console.log('TCL: uri', uri);
    let response = await axios.get(uri);
    let mcData = this.parseDayCount(response.data);
    //console.log('Today: mcData', mcData);
    this.todayCountArray = mcData.mcCount;
    this.getPrevDayCount();
  },
  getPrevDayCount: async function() {
    this.twoDaysCountArray = [];
    let dateInfo = this.getDateInfo();
    let api = 'api/GetPrevDay';
    let uri = [this.url, api, dateInfo.prevDate, dateInfo.prevDate].join('/');
    //console.log('TCL: uri', uri);
    let response = await axios.get(uri);
    let mcData = this.parseDayCount(response.data);
    //console.log('Prev: mcData', mcData);
    this.twoDaysCountArray.push(this.todayCountArray);
    this.twoDaysCountArray.push(mcData.mcCount);

    bus.$emit('TwoDaysCount', {
      labels: mcData.mcName,
      series: this.twoDaysCountArray
    });
  },
  parseDayCount(countArr) {
    let mcCount = [];
    let mcName = [];
    let objects = JSON.parse(JSON.stringify(countArr));
    objects.forEach(element => {
      if (element.Count === 1) {
        mcCount.push(0);
      } else {
        mcCount.push(element.Count);
      }
      mcName.push(element.MachineName);
    });
    return {
      mcName: mcName,
      mcCount: mcCount
    };
  },
  getmachineStatus: async function() {
    if (!Array.isArray(this.machineList) || !this.machineList.length) {
      // array does not exist, is not an array, or is empty
      // ⇒ do not attempt to process array
      this.getMachineList();
    }
    this.machineStatusArray = [];

    let dateInfo = this.getDateInfo();
    let api = 'api/GetMachineStatus';
    let uri = '';
    let response = '';
    //console.log('TCL: this.machineList.length', this.machineList.length);

    for (let x = 1; x < 5; x++) {
      uri = [this.url, api, x, dateInfo.currentDate, dateInfo.nextDate].join(
        '/'
      );
      //console.log('TCL: uri', uri);
      response = await axios.get(uri);
      this.parseStatusArray(response.data, 1);
    }

    bus.$emit('MachineStatus', {
      machineStatusArray: this.machineStatusArray,
      date: format(new Date(), 'dd MMMM')
    });
  },
  sec2time(timeInSeconds) {
    var pad = function(num, size) {
        return ('000' + num).slice(size * -1);
      },
      time = parseFloat(timeInSeconds).toFixed(3),
      hours = Math.floor(time / 60 / 60),
      minutes = Math.floor(time / 60) % 60;
    return pad(hours, 2) + 'h:' + pad(minutes, 2) + 'm';
  },
  parseStatusArray(statusArray, flag) {
    //flag = 2; for OEE module
    let runTime = 0;
    let idleTime = 0;
    let downTime = 0;
    let x = 0;
    for (x = 0; x < statusArray.length; x++) {
      let nextRecord = x + 1;
      if (nextRecord < statusArray.length) {
        let firstRow = statusArray[x]['StatusDateTime'];
        firstRow = new Date(firstRow);
        let nextRow = statusArray[x + 1]['StatusDateTime'];
        nextRow = new Date(nextRow);
        let secDiff = differenceInSeconds(nextRow, firstRow);
        let machineState = statusArray[x]['status'];

        switch (machineState) {
          case 'IDLE':
            idleTime = idleTime + secDiff;
            break;
          case 'DOWN':
            downTime = downTime + secDiff;
            break;
          case 'RUNNING':
            runTime = runTime + secDiff;
            break;
          default:
            break;
        }
      }
    }
    runTime = this.sec2time(runTime);
    idleTime = this.sec2time(idleTime);
    downTime = this.sec2time(downTime);
    //console.log('TCL: parseStatusArray -> statusArray', runTime, idleTime);
    let thisArray = Object.assign({}, this.machineStatusObject, {
      mcID: statusArray[0]['ID'],
      mcName: statusArray[0]['MachineName'],
      runTime: runTime,
      idleTime: idleTime,
      downTime: downTime
    });

    if (flag === 2) {
      this.machineOEEStatusArray.push(thisArray);
    } else {
      this.machineStatusArray.push(thisArray);
    }
  },
  populateOneWeekArray() {
    let oneWeekArray = [];
    let dateInfo = this.getDateInfo();
    let today = dateInfo.currentDate;
    // console.log('TCL: populateOneWeekArray -> today', today);
    oneWeekArray.push(today);
    let nextDay = '';
    for (let index = 1; index < 6; index++) {
      nextDay = subDays(new Date(today), index);
      nextDay = format(new Date(nextDay), 'yyyy-MM-dd');
      oneWeekArray.push(nextDay);
      nextDay = '';
    }
    return oneWeekArray;
  },
  getOEE() {
    this.machineOEEStatusArray = [];
    let oneWeekArray = this.populateOneWeekArray();

    let statusApi = 'api/GetMachineStatus';
    let partsApi = 'api/GetTotalParts';
    let uri = '';
    let startDate = '';
    //console.log('TCL: oneWeekArray', oneWeekArray.length);
    let index = 0;
    let oneWeekFormat = [];
    for (index = 0; index < oneWeekArray.length; index++) {
      let formatedDate = format(new Date(oneWeekArray[index]), 'do MMM');
      oneWeekFormat.push(formatedDate);
      // for (let mcID = 1; mcID < 5; mcID++) {
      //   if (index + 1 == oneWeekArray.length) {
      //     startDate = subDays(new Date(oneWeekArray[index]), 1);
      //     startDate = format(new Date(startDate), 'yyyy-MM-dd');
      //   } else {
      //     startDate = oneWeekArray[index + 1];
      //   }
      //   uri = [this.url, statusApi, mcID, startDate, oneWeekArray[index]].join(
      //     '/'
      //   );
      //   let statusResponse = await axios.get(uri);
      //   uri = [this.url, partsApi, mcID, startDate, oneWeekArray[index]].join(
      //     '/'
      //   );

      //   let partsResponse = await axios.get(uri);
      //   this.parseOEEArray();
      // } // Machine Array
    } // Date Array
    this.parseOEEArray(oneWeekFormat);
  },
  parseOEEArray(oneWeekFormat) {
    //this.parseStatusArray(statusArray, 2);
    let series = [
      [73.5, 65, 89, 70, 63.7, 55.6],
      [63.5, 55, 79, 60, 77.4, 65.7],
      [78.4, 75.4, 59, 80, 67.7, 70.5],
      [88.4, 67, 78.1, 70, 55.4, 69.6]
    ];

    bus.$emit('OeeInfo', {
      labels: oneWeekFormat,
      series: series
    });
  }
};
