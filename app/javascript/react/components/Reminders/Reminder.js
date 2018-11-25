import React, { Component } from 'react';
import Flatpickr from 'react-flatpickr'

class Reminder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reminder: this.props.reminder.reminder,
      date: this.props.reminder.time_due ? new Date(this.props.reminder.time_due) : this.roundUpToHour(new Date())
    };

    this.onChange = this.onChange.bind(this);
    this.updateReminder = this.updateReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.roundUpToHour = this.roundUpToHour.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.clickDate = this.clickDate.bind(this);
    this.submitReminder = this.submitReminder.bind(this);
  }

  roundUpToHour(date) {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  onChange(event){
    this.setState({reminder: event.target.value})
  }

  updateReminder(type){
    let data = this.state[type];
    if(type === "date" || data.replace(/\s+/g,'')){
      fetch(`/api/v1/reminders/${this.props.reminder.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          [type]: data
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
          credentials: 'same-origin'
      })
    }else{
      this.deleteReminder()
    }
  }

  submitReminder(event){
    event.preventDefault();
    document.activeElement.blur();
  }

  handleDateChange(date){
    this.setState({date: date[0]})
  }

  deleteReminder(){
    fetch(`/api/v1/reminders/${this.props.reminder.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(data => data.json())
    .then(data => {
      this.props.updateReminders(data)
    })
  }

  clickDate(event){
    this.updateReminder("date");
    let newDate = this.state.date.toISOString()
    this.props.clickDate(Number(event.target.id), newDate);
  }

  render(){
    let calendarHTML;
    const { date } = this.state;

    let dueDateHTML = (
      <i
        className="far fa-calendar-alt fa-lg reminder-cal-button link"
        onClick={this.clickDate}
        id={this.props.reminder.id}
        >
      </i>
    )

    if(this.props.reminder.time_due || this.props.selectedDate === this.props.reminder.id){
      if(!this.props.reminder.time_due && new Date() >= this.state.date){
          this.setState({date: this.roundUpToHour(new Date())})
        }
      dueDateHTML = (
        <Flatpickr
          data-enable-time
          value={date}
          onChange={(date) => {this.handleDateChange(date)}}
          onBlur={() => {this.updateReminder("date")}}
          options={{
            enableTime: true,
            dateFormat: "M. j, Y  h:i K",
            minDate: "Jan. 1, 2000 00:00 AM",
            onClose: () => {this.updateReminder("date")}
          }}
        />
      )
    }

    return(
      <div>
        <div className="reminder-row">
          <form onSubmit={this.submitReminder} className="reminder-item">
            <input
              type="text"
              className="editable-text"
              value={this.state.reminder}
              onChange={this.onChange}
              onBlur={() => {this.updateReminder("reminder")}}
            />
          </form>

          <div className="reminder-controls">
            {dueDateHTML}
            <span id={this.props.reminder.id} className="link" onClick={this.deleteReminder}>Delete</span>
          </div>
        </div>

      </div>
    )
  }
}

export default Reminder
