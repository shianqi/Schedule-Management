const baseUrl = 'http://localhost:3000'
let data = {}

$(document).ready(function() {
  const socket = io('http://localhost:3000')
  const eventBox = document.getElementById('event-box')
  const eventItem = document.getElementById('event')
  const button = document.getElementById('submit-button')
  eventBox.addEventListener('click', function(){
    eventBox.style.display = 'none'
  }, false)
  eventItem.addEventListener('click', function(e){
    // 阻止事件传播
    e.stopPropagation()
  }, false)
  button.addEventListener('click', function() {
    data.title = 'Hello World'
    data.backgroundColor = '#00ff00'
    socket.emit('addEvent', data)
  },false)

  $('#calendar').fullCalendar({
    header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month, agendaWeek, agendaDay'
		},
    editable: true,
    eventLimit: false, // allow "more" link when too many events
    dayClick: function(date, allDay, jsEvent, view) {
      data = {}
      data.start = moment(new Date(date._i)).format("YYYY-MM-DD")
      eventBox.style.display = 'block'
    },
    eventClick: function(calEvent, jsEvent, view) {
      console.log(calEvent, jsEvent)
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
      data.end = event.end.format("YYYY-MM-DD")
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
  })
});
