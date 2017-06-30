import React, { Component } from 'react'; //import the React library and the Component class from the react package
import OrganizationSelector from './organization-selector';

class AboutContainer extends Component { //create a class for the component
                                         //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
                        // or C's int main() or Python's def main()

        this.state = {}; //initial state, only manually assigned here, elsewhere it's this.setState()
    }

    render(){
        let strings = {      // define all your strings in an object like this one (the name of the keys can be anything)
                             // we use this for translation
            TitleString: 'About Participatory Learning',
            SentenceOne: 'Traditionally, students only solve problems. In the Participatory Learning system, students learn so much more by engaging with more stages of an assignment.',
            SentenceTwo: 'Here\'s the default process you\'ll follow, though this may vary among assignments. Everything shows as anonymous:',
            Step1: 'Each student creates a problem according to the instructions',
            Step2: 'The instructor optionally edits the problem to ensure quality',
            Step3: 'Another student solves the problem',
            Step4: 'Two students grade the solution, including the problem creator',
            Step5: 'If the graders disagree, another student resolves the grade',
            Step6: 'Optionally, the problem solver can dispute the grade',
            Step7: 'The instructor resolves any disputes',
            Step8: 'Students can see everything their peers have done anonymously',
            SectionTitle: 'Developers',
            SubTitle1: 'Spring Capstone 2016',
            SubTitle2: 'Summer 2016',
            SubTitle3: 'Fall Capstone 2016',
            SubTitle4: 'Spring Capstone 2017',
            SubTitle5: 'Summer 2017',
            SubTitle6: 'Version 1 - 2014 (CLASS System)',
            SubTitle7: 'For technical assistance please contact:',
            SubTitle8: 'For information about Participatory Learning Research or using this for your own courses, please contact:'

        };

        return (
          <div className="about">
            <div className="pl-description">
              <div className="section">
                  <h2 className="title">{strings.TitleString}</h2>
                  <div className="section-content">
                          <p>{strings.SentenceOne}</p>
                      <br />
                  <p>{strings.SentenceTwo}</p>

                    <ul>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step1}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step2}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step3}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step4}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step5}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step6}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step7}</p></li>
                          <li><i className="fa fa-check icon"></i><p>{strings.Step8}</p></li>
                    </ul>
                  </div>
              </div>
            </div>
            <div className="developers-section">
              <h2>{strings.SectionTitle}</h2>
              <div className="section">
                  <h2 className="title">{strings.SubTitle1}</h2>
                  <div className="section-content">
                          <ul>
                            <li>Stephen Morrison</li>
                            <li>Cesar Salazar </li>
                            <li>Christian Alexander</li>
                            <li>Andres Altamirano</li>
                          </ul>
                  </div>
              </div>

              <div className="section">
                  <h2 className="title">{strings.SubTitle2}</h2>
                  <div className="section-content">
                          <ul>
                              <li>Jimmy Lu</li>
                              <li>Alan Romano</li>
                              <li>Krzysztof Andres</li>
                              <li>Maia Iyer</li>
                              <li>Jason Gong</li>
                          </ul>
                  </div>
              </div>

              <div className="section">
                  <h2 className="title">{strings.SubTitle3}</h2>
                  <div className="section-content">
                          <ul>
                            <li>Jonathan Vidal</li>
                            <li>Angelica Llerena</li>
                          </ul>
                  </div>
              </div>

              <div className="section">
                  <h2 className="title">{strings.SubTitle4}</h2>
                  <div className="section-content">
                          <ul>
                            <li>Mohit Nakrani</li>
                            <li>Brice Delli Paoli</li>
                            <li>Brian Galok</li>
                            <li>Ashish Mirji</li>
                          </ul>
                  </div>
                </div>

                  <div className="section">
                      <h2 className="title">{strings.SubTitle5}</h2>
                      <div className="section-content">
                              <ul>
                                <li>Names Placeholder</li>
                              </ul>
                      </div>
                  </div>

                  <div className="section">
                      <h2 className="title">{strings.SubTitle6}</h2>
                      <div className="section-content">
                              <ul>
                                <li>Sean Fisher</li>
                                <li>Joshua Ortega</li>
                              </ul>
                      </div>
                  </div>

                  <div className="section">
                      <h2 className="title">{strings.SubTitle7}</h2>
                      <div className="section-content">

                      <OrganizationSelector
                				key={1}
                				apiUrl={this.props.apiUrl}
                				strings={this.strings}
                				userID={this.props.UserID}
                			/>

                      </div>
                  </div>

                  <div className="section">
                      <h2 className="title">{strings.SubTitle8}</h2>
                      <div className="section-content">
                              <ul>
                                <li>Michael Bieber</li>
                                <li style={{textAlign: 'left'}}>New Jersey Institute of Technology</li>
                                <li><a href="mailto:bieber@njit.edu">bieber@njit.edu</a></li>
                                <li style={{textAlign: 'left'}}><a href="http://web.njit.edu/~bieber/pubs.html#p" target="_blank">http://web.njit.edu/~bieber/pubs.html#p</a></li>
                              </ul>
                      </div>
                  </div>

              </div>
            </div>

        );
    }
}

export default AboutContainer;
