/* eslint-disable */
// import { createWriteStream } from 'streamsaver';
import axios from "../services/api"

import { saveAs } from 'file-saver';

export default function downloadItem(url, fileName){
	saveAs(url, fileName);

}


// export default function downloadItem(url, fileName){
// 	return new Promise(( resolve, reject ) => {
// 		axios.get(url)
// 			.then(res => {
// 				console.log(res)
// 				resolve()
// 				const fileStream = createWriteStream(fileName);
// 				const writer = fileStream.getWriter();
				
// 				if (res.body.pipeTo) {
// 					writer.releaseLock();
// 					return res.body.pipeTo(fileStream);
// 				}

// 				const reader = res.body.getReader();
// 				const pump = () =>
// 				reader
// 					.read()
// 					.then(({ value, done }) => (done ? writer.close() : writer.write(value).then(pump)));

// 				return pump();
// 			})
// 			.catch(reject)
// 	})
// }