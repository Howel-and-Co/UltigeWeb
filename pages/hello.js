export default function Hello() {
  const moment = require('moment-timezone');
  moment.locale('id');

  return (
    <>
      <p style={{marginLeft: 15}}>Welcome to Ultige Web! Today is {moment().format()}</p>
    </>
  );
}
