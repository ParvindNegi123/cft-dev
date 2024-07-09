import moment from "moment";

const generateTimeSeries = (intervalTime, minutes) => {
    if (minutes <= 0) {
        return [];
    }

    const timeSeries = [];
    const interval = moment.duration(intervalTime, 'minutes');

    const startTime = moment().set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
    const endTime = startTime.clone().add(minutes, 'minutes');

    while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
        const formattedStartTime = startTime.format('hh:mm A');
        const formattedEndTime = startTime.clone().add(intervalTime, 'minutes').format('hh:mm A');
        timeSeries.push({ startTime: formattedStartTime, endTime: formattedEndTime });
        startTime.add(interval);
    }

    return timeSeries;
}

export default generateTimeSeries;