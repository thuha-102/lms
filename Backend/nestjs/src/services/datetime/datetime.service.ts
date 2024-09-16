export class DatetimeService {
  public static formatVNTime(value: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    return value.toLocaleDateString('vi-VN', options).replace(/\//g, '-');
  }
}
