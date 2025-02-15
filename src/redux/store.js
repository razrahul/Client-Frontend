import { configureStore } from '@reduxjs/toolkit';
import areaSlice  from './reducers/areaSlice.js';
import citySlice from './reducers/citySlice';
import teacherSlice from './reducers/teacherSlice.js';
import contactSlice from './reducers/contactSlice';
import subjectSlice from './reducers/subjectslice.js';
import faqSlice from './reducers/faqslice.js';




const store = configureStore({
    reducer: {
        // Add your reducers here
        area: areaSlice,
        city: citySlice,
        teacher: teacherSlice,
        contact: contactSlice,
        subject: subjectSlice,
        faq: faqSlice,
    },
});

export default store;

// import { configureStore } from '@reduxjs/toolkit';
// import {thunk} from 'redux-thunk';
// import areaSlice from './reducers/areaSlice';
// import citySlice from './reducers/citySlice';
// import teacherSlice from './reducers/teacherSlice';
// import contactSlice from './reducers/contactSlice';
// import subjectSlice from './reducers/subjectslice';


// const store = configureStore({
//   reducer: {
//     area: areaSlice,
//     city: citySlice,
//     teacher: teacherSlice,
//     contact: contactSlice,
//     subject: subjectSlice,
//   },
//   // middleware: (getDefaultMiddleware) =>
//   //   getDefaultMiddleware().concat(thunk), // Ensure thunk is added to the middleware
// });

// export default store;
