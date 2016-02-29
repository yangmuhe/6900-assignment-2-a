console.log('Homework 2-A...')

d3.csv('../data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    console.log(rows);

    var cf = crossfilter(rows);
    var tripsByTime = cf.dimension(function(d){ return d.startTime; });
    var tripsByGender = cf.dimension(function(d){ return d.gender; });
    var tripsByStation = cf.dimension(function(d){ return d.startStation; });
    var tripsByDuration = cf.dimension(function(d){ return d.duration; });

    //The order of filter is important. The later one is added on the previous one.
    var totalTrips2012 = tripsByTime.filter([new Date(2012,1,1), new Date(2012,12,31)]).top(Infinity).length; //new Date(year, month, day)
    console.log("Total number of trips in 2012 is " + totalTrips2012);

    var totalTripsMale = tripsByGender.filter("Male").top(Infinity).length;
    console.log("Total number of trips in 2012 AND taken by male, registered users is " + totalTripsMale);

    //Clear the filter
    tripsByGender.filterAll();
    //tripsByGender.filter(null);  //works the same

    var totalTrip2012NEU = tripsByStation.filter("5").top(Infinity).length;
    console.log("total number of trips in 2012, by all users (male, female, or unknown), starting from Northeastern is " + totalTrip2012NEU);

    //Clear the filter
    tripsByTime.filterAll();
    tripsByStation.filterAll();

    var top50TripsDuration = tripsByDuration.top(50);
    console.log("Top 50 trips, in all time, by all users, regardless of starting point, in terms of trip duration, are:");
    console.log(top50TripsDuration);

    //Group
    var tripsByAge = cf.dimension(function(d){ return d.age; });
    var groupTripsByAge = tripsByAge.group(function(d){ return Math.floor(d/10); });
    console.log("Group all trips into 10-year age buckets: ");
    console.log(groupTripsByAge.all());

}

function parse(d){
    if(+d.duration<0) return;

    var birthdate = (d.birth_date == "..")? undefined: +d.birth_date;
    var age = parseDate(d.start_date).getFullYear() - birthdate; //.getFullYear() returns the 4-digit year

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
        gender: (d.gender == "..")? undefined: d.gender,
        age: age
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

