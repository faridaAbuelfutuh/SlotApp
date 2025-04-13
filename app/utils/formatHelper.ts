import moment from "moment";

export default class FormatHelper {
    static formatNumber(num: number) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    static formatDate(date: Date): string{
        return date.toISOString(); // or format however you like (e.g., 'yyyy-MM-dd')
      };

      static getTimeZones() {
        const timeZones = moment.tz.names();
        return timeZones;
      }
}