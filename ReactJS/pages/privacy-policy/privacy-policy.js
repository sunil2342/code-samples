import React, { Component } from 'react';

class PrivacyPolicy extends Component {
    render() {
        return(
            <React.Fragment>
                <section id="breadcrumb">
                    <div className="row">
                        <div className="large-12 columns">
                            {/*<nav aria-label="You are here:">
                                <ul className="breadcrumbs">
                                    <li><i className="fa fa-home"></i><a href=" ">Home</a></li>
                                    <li><a href=" ">profile</a></li>
                                    <li>
                                        <span className="show-for-sr">Current: </span> submit post
                                    </li>
                                </ul>
                            </nav>*/}
                        </div>
                    </div>
                </section>

                <div className="row" style={{marginTop: "30px"}}>

                    <div className="large-12 columns profile-inner">
                        <section className="singlePostDescription">
                            <div className="row secBg">
                                <div className="large-12 columns" style={{padding: '50px'}}>
                                    <div className="heading" style={{textAlign: 'center'}}>
                                        <h3>Welcome  to  our  privacy  policy </h3>
                                        <p>
                                            Effective  date:  July  10,  2018
                                        </p>

                                    </div>
                                    <div className="description" style={{fontSize: '20px'}}>
                                        <p style={{fontSize: '20px'}}>Scientistpage  ("us",  "we",  or  "our")  operates  the www.scientistpage.com  website  (the  "Service").</p>
                                        <p style={{fontSize: '20px'}}>This  page  informs  you  of  our  policies  regarding  the  collection,  use,  and  disclosure  of  personal  data  when  you  use  our  Service  and  the  choices  you  have  associated  with  that  data.  This  policy  may  subject  to  change  from  time  to  time.  You  are  kindly  requested  to  review  this  privacy  policy  periodically  for  any  changes. </p>
                                        <ol>
                                            <li>Scientist Page  is  an  open  source  platform  and  the  videos  submitted  by  the  users  can  be  viewed  by  anyone  without  registering  on  scientistpage. </li>
                                            <li>Users  are  themselves  responsible  for  the  content  submitted  in  the  form  of  videos  or  posts.  We  don’t  take  responsibility  of  the  violation  of  copyright  of  any  journal. </li>
                                            <li>We  collect  the  personal  information  of  users  including  name,  email,  university  and  the  research  field  in  order  to  connect  you  with  the  researchers  working  in  your  field  and  bring  you  the  material  relevant  to  your  research.  </li>
                                            <li>We  do  not  share  the  personal  information  or  data  of  users  to  any  third  party  website  or  the  company. </li>
                                            <li>If  you  login  with  your  Linkedin,  Facebook  or  Google  account,  we  access  your  name,  email  address  and  photo.  We  don’t  have  access  to  your  inbox  or  friends  link. </li>
                                            <li>We  don’t  store  or  process  or  store  personal  information  about  your  race,  political  views  or  sexual  orientation. </li>
                                            <li>Our  website  has  links  to  various  journal  websites.  If  you  click  on  the  link,  you  will  be  redirected  to  that  website.  We  strongly  advise  you  to  read  the  privacy  policy  of  the  website  you  are  visiting.  We  are  not  responsible  for  your  actions  on  any  other  website.   </li>
                                        </ol>
                                        <p style={{fontSize: '20px'}}>
                                            If  you  have  any  other  questions  or  concerns,  please  get  in  touch  with  us  at  <a href="mailto:info@scientistpage.com">info@scientistpage.com</a>
                                        </p>
                                        <h5>Enjoy Your Research</h5>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default PrivacyPolicy;