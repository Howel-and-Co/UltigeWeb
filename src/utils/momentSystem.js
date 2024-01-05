import axios from 'axios';
import moment from 'moment-timezone';
import 'moment/locale/id';

moment.locale('id');
moment.tz.setDefault("Asia/Jakarta");

let serverTime, actualTime, timeOffset;

const timerHandler = () => {
    actualTime = moment();
    
    // Add the calculated offset
    actualTime.add(timeOffset);
        
    // Re-run this next second wrap
    setTimeout(timerHandler, (1000 - (new Date().getTime() % 1000)));
};

// Fetch the server time through a HEAD request to the current URL
// using asynchronous request.
const fetchServerTime = async () => {
    try {
        const result = await axios.get(`https://api.ultige.com/ultigeapi/getcurrenttime`);
        const processedData = result.data;

        // Turn the "Date:" header field into a "moment" object,
        // use JavaScript Date() object as parser
        serverTime = moment(processedData.CurrentTime); // Read
        
        // Store the differences between device time and server time
        timeOffset = serverTime.diff(moment());
        
        // Now when we've got all data, trigger the timer for the first time
        timerHandler();
    } 
    catch (error) {
        console.error('Error fetching server time:', error.message);
    }
}

// Trigger the whole procedure
fetchServerTime();
actualTime = moment();

// Export a function that returns the current time
export const getCurrentTime = () => moment(actualTime);