import React, {Component} from 'react';
import DatePicker from 'react-16-bootstrap-date-picker';

class DatetimePick extends Component {
  constructor (props) {
    super (props);

    this.state = {value: ''};
    this.handleChange = this.handleChange.bind (this);
  }

  handleChange (value, formattedValue) {
    //为其自带参数
    this.setState ({
      value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue, // Formatted String, ex: "11/19/2016"
    });
  }

  render () {
    return (
      <DatePicker
        id="example-datepicker"
        value={this.state.value}
        onChange={this.handleChange}
        dateFormat="YYYY/MM/DD"
        showClearButton={false}
      />
    );
  }
}
export default DatetimePick;
