import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import firebase from '../../firebase';
function loader(img) {
  if (img === true) {
    return (
      <div class="loader">Loading...</div>
    );
  } else {
    return "";
  }
}
class BookingDetails extends Component {

constructor(props){
  super(props);
  this.state = {
  loader:true
  }
}



componentDidMount(){
  const bookRef = firebase.database().ref('bookings/'+this.props.match.params.id);
  bookRef.on("value", snapshot =>{
    let models = snapshot.val();
    this.setState({
      customer_id:models.customer_id,
      technician_id:models.technician_id,
      brand_id:models.brand_id,
      model_id:models.model_id,
      issue_id:models.issue_id,
      amount:models.amount,
      color:models.color,
      booking_status:models.booking_status?models.booking_status:'-',
      request:models.request,
      date_of_delivery:models.date_of_delivery,
      remark:models.remark,
      created_at:models.created_at,
      loader:false
    })
  });
  const modelRef = firebase.database().ref('models');
  modelRef.on('value', (snapshot) => {
    this.setState({
      models:snapshot.val()
    })
});
  const branRef = firebase.database().ref('brands');
  branRef.on('value', (snapshot) => {
    this.setState({
      brands:snapshot.val()
    })
});
  const userRef = firebase.database().ref('users');
  userRef.on('value', (snapshot) => {
    this.setState({
      users:snapshot.val(),
    })
});
const issueRef = firebase.database().ref('issues');
issueRef.on('value', (snapshot) => {
  this.setState({
    issues:snapshot.val(),
    loader:false
  })
});

}


render() {

    const brandName = (brandId) =>{
      let data = this.state.brands;
      for(let brand in data){
        if(brand === brandId){
          return data[brand].brand_name_en;
        }
      }
    }
    const userName = (userId) =>{
      let data = this.state.users;
      for(let user in data){
        if(user === userId){
          return data[user].email;
        }
      }
    }
    const modelName = (modelId) =>{
      let data = this.state.models;
      for(let model in data){
        if(model === modelId){
          return data[model].model_name_en;
        }
      }
    }
    const issueName = (issueId) =>{

      let data = this.state.issues;
      for(let issue in data){
        if(issue === issueId){
          return data[issue].issue_name_en;
        }
      }
    }

    const issuelist = () =>{
      let issues =[];
      let data = this.state.issue_id;
      for(let issue in data){
        issues.push({
            issue_name:issueName(data[issue].id),
            amount:data[issue].amount
          })
        }
      return issues;
    }


    return (
      <div className="animated fadeIn">
        <Row>
        {loader((this.state.loader))}
          <Col >
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Booking id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive  hover>
                    <tbody>
                    <tr><td>Customer </td><td>{userName(this.state.customer_id)}</td></tr>
                    <tr><td>Technician </td><td>{userName(this.state.technician_id)}</td></tr>
                    <tr><td>Brand </td><td>{brandName(this.state.brand_id)}</td></tr>
                    <tr><td>Model </td><td>{modelName(this.state.model_id)}</td></tr>
                    <tr><td>Issue</td><td><ul>{issuelist().map((issue) =>{
                      return (
                        <li>{issue.issue_name}  -  Amount : {issue.amount}</li>
                      )
                    } )}</ul></td></tr>
                    <tr><td>Amount</td><td>SAR {this.state.amount}</td></tr>
                    <tr><td>Color</td><td>{this.state.color}</td></tr>
                    <tr><td>Request</td><td>{this.state.request}</td></tr>
                    <tr><td>Booking status</td><td>{this.state.booking_status}</td></tr>
                    <tr><td>Date of delivery</td><td>{this.state.date_of_delivery}</td></tr>
                    <tr><td>Remark</td><td>{this.state.remark}</td></tr>
                    <tr><td>Booking Date</td><td>{this.state.created_at}</td></tr>
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BookingDetails;
