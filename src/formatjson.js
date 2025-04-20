import { eachDayOfInterval, format, isWithinInterval } from "date-fns";
import jsonexport from "jsonexport/dist";

const jsonToCSV = (json) =>
  new Promise((resolve, reject) => {
    jsonexport(json, function (err, csv) {
      if (err) return reject(err);

      resolve(csv);
    });
  });

export const formatFloJson = (data) => {
  const cycles = data.operationalData.cycles;
  
  // sort in descending order, to ensure the intervals logic works
  cycles.sort((a, b) => {
    const aD = new Date(a.period_start_date);
    const bD = new Date(b.period_start_date);
    
    return bD.getTime() - aD.getTime();
  });

  const endDate = new Date(cycles[0].period_end_date);
  const startDate = new Date(cycles[cycles.length - 1].period_start_date);
  const interval = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  const parsedData = interval.map((date) => {
    const isInInterval = cycles.find(({ period_start_date, period_end_date }) =>
      isWithinInterval(date, {
        start: new Date(period_start_date),
        end: new Date(period_end_date),
      })
    );
    return {
      date: format(new Date(date), "yyyy-MM-dd"),
      "bleeding.value": isInInterval ? "2" : "",
      "bleeding.exclude": isInInterval ? "FALSE" : "",
      ...extraFields,
    };
  });

  return jsonToCSV(parsedData);
};

const extraFields = {
  "temperature.value": "",
  "temperature.exclude": "",
  "temperature.time": "",
  "temperature.note": "",

  "mucus.feeling": "",
  "mucus.texture": "",
  "mucus.value": "",
  "mucus.exclude": "",
  "cervix.opening": "",
  "cervix.firmness": "",
  "cervix.position": "",
  "cervix.exclude": "",
  "note.value": "",
  "desire.value": "",
  "sex.solo": "",
  "sex.partner": "",
  "sex.condom": "",
  "sex.pill": "",
  "sex.iud": "",
  "sex.patch": "",
  "sex.ring": "",
  "sex.implant": "",
  "sex.diaphragm": "",
  "sex.none": "",
  "sex.other": "",
  "sex.note": "",
  "pain.cramps": "",
  "pain.ovulationPain": "",
  "pain.headache": "",
  "pain.backache": "",
  "pain.nausea": "",
  "pain.tenderBreasts": "",
  "pain.migraine": "",
  "pain.other": "",
  "pain.note": "",
  "mood.happy": "",
  "mood.sad": "",
  "mood.stressed": "",
  "mood.balanced": "",
  "mood.fine": "",
  "mood.anxious": "",
  "mood.energetic": "",
  "mood.fatigue": "",
  "mood.angry": "",
  "mood.other": "",
  "mood.note": "",
};
