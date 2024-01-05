import moment from 'moment-timezone';
import 'moment/locale/id';

moment.locale('id');
moment.tz.setDefault("Asia/Jakarta");

export default moment;