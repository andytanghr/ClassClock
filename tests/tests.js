// QUnit.test( "hello test", function( assert ) {
//     assert.ok( 1 == "1", "Passed!" );
//   });

//TODO: Add mock school and schedule data here

QUnit.test("Test Update Time", function( assert ) {
    var now = new Date("2019/01/07 22:25:06");
    updateTime(now)
    
    assert.equal(currentDate, now, "currentDate set successfully");
    assert.equal(currentDay, now.getDay(), "currentDay set successfully");
    assert.equal(currentHours, now.getHours(), "currentHours set successfully");
    assert.equal(currentMinutes, now.getMinutes(), "currentMinutes set successfully");
    assert.equal(currentSeconds, now.getSeconds(), "currentSeconds set successfully");

  });

  QUnit.test("Test getting time as string from object", function( assert ) {

    time = {hours: 1, minutes:7, seconds:4};


    assert.equal(getTimeStringFromObject(time, true), "01:07:04", "test low time with seconds");
    assert.equal(getTimeStringFromObject(time, false), "01:07", "test low time without seconds");


    time.hours = time.hours + 10;
    time.minutes = time.minutes + 20;
    time.seconds = time.seconds + 30;

    assert.equal(getTimeStringFromObject(time, true), "11:27:34", "test time with seconds");
    assert.equal(getTimeStringFromObject(time, false), "11:27", "test time without seconds");


  });

  QUnit.test("Test getting formatted time", function( assert ) {

    time = {hours: 1, minutes:07};

    assert.equal(getFormattedTimeStringFromObject(time, false), "01:07 AM", "test low  AM 12-hour time");
    assert.equal(getFormattedTimeStringFromObject(time, true), "01:07", "test low AM 24-hour time");

    time.hours = time.hours + 10;
    time.minutes = time.minutes + 30;

    assert.equal(getFormattedTimeStringFromObject(time, false), "11:37 AM", "test AM 12-hour time");
    assert.equal(getFormattedTimeStringFromObject(time, true), "11:37", "test AM 24-hour time");

    time.hours = time.hours + 3;
    time.minutes = time.minutes - 30;

    assert.equal(getFormattedTimeStringFromObject(time, false), "02:07 PM", "test low PM 12-hour time");
    assert.equal(getFormattedTimeStringFromObject(time, true), "14:07", "test low minutes PM 24-hour time");

    time.hours = time.hours + 8;
    time.minutes = time.minutes + 30;

    assert.equal(getFormattedTimeStringFromObject(time, false), "10:37 PM", "test PM 12-hour time");
    assert.equal(getFormattedTimeStringFromObject(time, true), "14:37", "test PM 24-hour time");

  });

  QUnit.test("Test converting ms to time object", function( assert ) {
      //H+M+S
    var ms = (1000 * 60 * 60 * 6) + (1000 * 60 * 24) + (1000 * 42)
    
    assert.deepEqual(convertMillisecondsToTime(ms), {hours: 6, minutes:24, seconds:42, milliseconds: 0}, "perfect milliseconds converted successfully");

    //this is commented out in the code as it isnt used
    // ms += 394;
    // assert.deepEqual(convertMillisecondsToTime(ms), {hours: 6, minutes:24, seconds:42, milliseconds: 394}, "imperfect milliseconds converted successfully");
    

  });

  QUnit.test("Test calculating relative time deltas", function( assert ) {
    //H+M+S
    time1 = {hours: 13, minutes:27, seconds:43}
    time2 = {hours: 1, minutes:07, seconds: 00};
  
  assert.deepEqual(getTimeDelta(time1, time2), {hours: 12, minutes:20, seconds:43, milliseconds: 0}, "late to earlier delta computed successfully");

  time2.hours += 15;

  assert.deepEqual(getTimeDelta(time1, time2), {hours: 2, minutes:39, seconds:17, milliseconds: 0}, "early to later delta computed successfully");

});

QUnit.test("Test given time is before current time", function( assert ) {
    //H+M+S
  currentHours = 13;
  currentMinutes = 27;
  currentSeconds = 43;

  time = {hours: 1, minutes:07};
  
  assert.ok(checkGivenTimeIsBeforeCurrentTime(time), "succeeds when given time is before current time");

  time = {hours: 16, minutes:07};

  assert.notOk(checkGivenTimeIsBeforeCurrentTime(time), "fails when given time is not before current time");
  

});

QUnit.test("Test currentDateString", function( assert ) {

  assert.ok(getCurrentDateString().includes(currentDate.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })), "result contains current formatted date");

});

QUnit.test("Test currentTimeString", function( assert ) {

    currentDate = new Date();

    assert.equal(getCurrentTimeString(true), currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }), "can return 24-hour time");

    assert.equal(getCurrentTimeString(false), currentDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }), "can return 12-hour time");
  
  });

  QUnit.test("Test getCurrentScheduleIndex", function( assert ) {

    selectedSchoolIndex = 0;

    assert.ok(schools[selectedSchoolIndex].schedules )
  
  });