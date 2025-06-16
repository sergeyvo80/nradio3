import type { NextPage } from 'next'
// import { END } from 'redux-saga';
import { NRadioContainer } from '../../containers/NRadioContainer';
// import { SagaStore, wrapper } from '../../app/store';
// import {
//     getStationList,
//     getStation,
// } from '../../features/nradio/nradioSlice';
// import stationData from '../../data/station.json';


const StationPage: NextPage = () => {
    return (
        <NRadioContainer />
    );
};


// export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
    // const { slug } = ctx.query;
    // store.dispatch(getStationList());
    // store.dispatch(getStation(!Array.isArray(slug) ? slug : stationData.slug));
    // store.dispatch(END);
    // await (store as SagaStore).sagaTask.toPromise();
    // return {
    //     props: {
    //     }
    // };
// });

export default StationPage;
