import moment from 'moment-timezone';
import 'moment/locale/id';

export default function Hello() {
  moment.locale('id');

  return (
    <>
      <p style={{marginLeft: 15}}>Welcome to Ultige Web! Today is {moment().format()}</p>
    </>
  );
}
