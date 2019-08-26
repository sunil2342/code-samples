import React, { Component } from "react";
import { NotificationContainer, NotificationManager } from "react-notifications";
import { Button, Badge, Card, CardBody, CardHeader, Col, Row, UncontrolledTooltip, Table } from "reactstrap";
import "react-notifications/lib/notifications.css";
import Datatable from 'react-bs-datatable';
import firebase from "../../firebase.js";

function loader(img) {
  if (img === true) {
    return (
      <div class="loader">Loading...</div>
    );
  } else {
    return "";
  }
}

function getBadge(status) {
  if (status === 1) {
    return "success";
  } else {
    return "danger";
  }
}

function getStatus(status) {
  if (status === 1) {
    return "Active";
  } else {
    return "Inactive";
  }
}

class Bookings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      loader: true
    };
  }

  componentDidMount() {

    const bookingRef = firebase.database().ref("bookings");
    bookingRef.on("value", snapshot => {
      this.setState({
          bookings: snapshot.val(),
      });
    });
    const userRef = firebase.database().ref('users');
    userRef.on('value', (snapshot) => {
      this.setState({
        users:snapshot.val(),
        loader:false
      })
    });
  }

    updateStatus(dataId,status) {
      var UserStatus = 1;
      console.log(dataId,status);
      const brandRef = firebase.database().ref("/bookings/"+dataId);
      if (status == 1) UserStatus = 0;
      brandRef.update(
          {
            status: UserStatus,
          }).then((brandRef) => {
           NotificationManager.success("Status has been updated successfully.")
          })
          .catch((error) => {
           NotificationManager.error("Either something went wrong or invalid access.");
          });
    }
render() {
  const userName = (userId) =>{
      let data = this.state.users;
      for(let user in data){
        if(user === userId){
          return data[user].email;
        }
      }
    }
 const bookingData = () =>{
   let bookings = [];
   var i = 1;
   var data = this.state.bookings;
   for(let booking in data){
     if(data[booking].request==='Accepted'){
      bookings.push({
        id: i,
        customer_id: userName(data[booking].customer_id),
        request: data[booking].request,
        booking_status: data[booking].booking_status?data[booking].booking_status:'-',
        status: <div><Badge  onClick={() =>this.updateStatus(booking,data[booking].status) } color={ getBadge(data[booking].status) } > { getStatus(data[booking].status) }</Badge></div>,
        date: data[booking].created_at,
        action:<div><a href={'#/bookings/'+booking}> <Badge id={'view'+i} color="danger"> <i className="fa fa-eye"></i></Badge><UncontrolledTooltip placement="top" target={"view"+i}>View Booking Details</UncontrolledTooltip></a></div>
      })
    i++;
   }
   }
   return bookings;
 }
  const header = [
      { title: 'Sl. No.', prop: 'id', sortable: true },
      { title: 'Customer', prop: 'customer_id', sortable: true, filterable: true },
      { title: 'Request', prop: 'request', sortable: true, filterable: true },
      { title: 'Booking status', prop: 'booking_status' ,sortable:true },
      { title: 'Created At', prop: 'date', sortable: true ,filterable: true},
      { title: 'Status', prop: 'status', sortable: true ,filterable: true},
      { title: 'Action', prop: 'action'},
      ];
  const body = bookingData();
  const customLabels = {
    first: 'First',
    last: 'Last',
    prev: 'Prev',
    next: 'Next',
    show: 'Display',
    entries: 'rows',
    noResults: 'There is no data to be displayed',
  };

    return (
      <div className="animated fadeIn">
        <NotificationContainer />
        <Row>
        {loader(this.state.loader)}
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify" /> Booking
                <small className="text-muted"> Listing</small>
              </CardHeader>
              <CardBody className="customizeMe">
              <Datatable
                  tableHeader={header}
                  tableBody={body}
                  keyName="userTable"
                  tableClass="hover   responsive"
                  rowsPerPage={10}
                  rowsPerPageOption={[10, 20,30,40]}
                  initialSort={{prop: "id", isAscending: true}}
                  labels={customLabels} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Bookings;
