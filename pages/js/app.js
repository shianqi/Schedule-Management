const baseUrl = 'http://localhost:3000'
let data = {}

$(document).ready(function() {
  const socket = io('http://localhost:3000')
  const eventBox = document.getElementById('event-box')
  const eventItem = document.getElementById('event')
  const submitButton = document.getElementById('submit-button')
  const modifyButton = document.getElementById('modify-button')
  const deleteButton = document.getElementById('delete-button')
  const title = $('#form-title')
  const emergencyLevel = $('#form-emergency-level')

  eventBox.addEventListener('click', function(){
    eventBox.style.display = 'none'
  }, false)

  eventItem.addEventListener('click', function(e){
    // 阻止事件传播
    e.stopPropagation()
  }, false)

  submitButton.addEventListener('click', function() {
    data.title = title.val().trim()
    data.emergencyLevel = emergencyLevel.val()
    socket.emit('addEvent', data)
  }, false)

  modifyButton.addEventListener('click', function() {
    data.title = title.val().trim()
    data.emergencyLevel = emergencyLevel.val()
    socket.emit('modifyEvent', data)
  }, false)

  deleteButton.addEventListener('click', function() {
    socket.emit('deleteEvent', data._id)
  }, false)

  $('#calendar').fullCalendar({
    header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month, agendaWeek, agendaDay'
    },
    themeSystem: 'bootstrap3',
    editable: true,
    eventLimit: false, // allow "more" link when too many events
    dayClick: function(_date, allDay, jsEvent, view) {

      data.start = moment(new Date(_date._i)).format("YYYY-MM-DD")
      submitButton.style.display = 'inline-block'
      modifyButton.style.display = 'none'
      deleteButton.style.display = 'none'
      eventBox.style.display = 'block'
    },
    eventClick: function(calEvent, jsEvent, view) {
      data = {}
      data._id = calEvent._id
      title.val(calEvent.title)
      emergencyLevel.val(calEvent.emergencyLevel)
      submitButton.style.display = 'none'
      modifyButton.style.display = 'inline-block'
      deleteButton.style.display = 'inline-block'
      eventBox.style.display = 'block'
    },
    eventResize: function(event,dayDelta,minuteDelta,revertFunc) {
      data = {}
      data.start = event.start.format("YYYY-MM-DD")
      data.end = event.end.format("YYYY-MM-DD")
      data._id = event._id
      socket.emit('eventResize', data)
    },
    eventDrop: function(event) {
      data = {}
      data.start = event.start.format("YYYY-MM-DD")
      if(event.end){
        data.end = event.end.format("YYYY-MM-DD")
      }
      data._id = event._id
      socket.emit('eventDragStop', data)
    },
    events: `${baseUrl}/getData`
  })

  socket.on('dataAddSuccess', function(){
    console.log('dataAddSuccess')
    $('#calendar').fullCalendar('refetchEvents')
    eventBox.style.display = 'none'
  })

  socket.on('dataUpdate', function(){
    console.log('dataUpdate')
    $('#calendar').fullCalendar('refetchEvents')
    eventBox.style.display = 'none'
  })
});
