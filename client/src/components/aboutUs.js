import React, {Component} from 'react';

class AboutUs extends Component {
  state = {
  };

  render() {
      return (
          <section className="section aboutus">
              <div className="container">
                  <div className="aboutus-title">Feed the Need - NGO free distributed & scalable food donation system</div>
                  <div>
                      <p> Every person feels to feed the hunger, more specifically in difficult times like covid-19 & more happily if they are assured that its been reaching the need. </p>
                      <br/>
                      <p>Having NGO as centralized system of donation is not scalable, reachable & feasible at every place.</p>
                      <br/>
                      <p>Our idea you can relate with distributed system of food donation.</p>
                      <br/>
                      <p><b>DONAR</b> - Individual wants to donate food on specific date of specific quantity.</p>
                      <br/>
                      <p><b>NEEDY </b>- Person is in need of food during specific date & time. They are not using app, they are just poor who are being noticed by HELPING HAND person/group.</p>
                      <br/>
                      <p><b>HELPING HAND</b> - would be the one who would be collecting the food from PROVIDER & will provide the food to NEEDY ( helping hand can be public servant like police, muncipalty person etc or some individual/group)</p>
                      <hr></hr>
                      <p><b>BUSINESS VALUE</b> -- This idea itself can be considered as prototype implementation of business sceanrio. 
                        Many scenarios can use this underlying model.
                        <div>Food is the transactional entity which can be replaced with any other business entity</div>
                      </p>
                  </div>
              </div>
          </section>
      );
  }
}

export default AboutUs;