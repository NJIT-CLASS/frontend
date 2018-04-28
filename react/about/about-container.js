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
            TitleString: 'Participatory Learning',
            Sentence0: 'Traditionally, students only solve problems. In the Participatory Learning system, students learn so much more by engaging with more stages of an assignment.',
            Sentence1: 'Here\'s the default process you\'ll follow, though this may vary among assignments. Everything shows as anonymous:',
            Step0: 'Each student creates a problem according to the instructions',
            Step1: 'The instructor optionally edits the problem to ensure quality',
            Step2: 'Another student solves the problem',
            Step3: 'Two students grade the solution, including the problem creator',
            Step4: 'If the graders disagree, another student resolves the grade',
            Step5: 'Optionally, the problem solver can dispute the grade',
            Step6: 'The instructor resolves any disputes',
            Step7: 'Students can see everything their peers have done anonymously',
            SectionTitle0: 'Developers',
            SectionTitle1: 'Contact',
            SubTitle0: 'Version 1 - 2014 (CLASS System)',
            SubTitle1: 'Spring Capstone 2016',
            SubTitle2: 'Summer 2016',
            SubTitle3: 'Fall Capstone 2016',
            SubTitle4: 'Spring Capstone 2017',
            SubTitle5: 'Summer 2017',
            SubTitle8: 'Fall 2017',
            SubTitle9: 'Spring 2018',
            SubTitle6: 'For technical assistance please contact:',
            SubTitle7: 'For information about Participatory Learning Research or using this for your own courses, please contact:'

        };


        let studentData = [
            {
                semesterTitle: strings.SubTitle0,
                topPerformers: [],
                contributors: ['Sean Fisher','Joshua Ortega']
            },
            {
                semesterTitle: strings.SubTitle1,
                topPerformers: ['Stephen Morrison','Cesar Salazar'],
                contributors: ['Christian Alexander','Andres Altamirano'], 
            },
            {
                semesterTitle: strings.SubTitle2,
                topPerformers: ['Jimmy Lu','Alan Romano'],
                contributors: ['Krzysztof Andres','Maia Iyer','Jason Gong']
            },
            {
                semesterTitle: strings.SubTitle3,
                topPerformers: ['Jonathan Vidal','Angelica Llerena'],
                contributors: []
            },
            {
                semesterTitle: strings.SubTitle4,
                topPerformers: ['Mohit Nakrani','Brice Delli Paoli'],
                contributors: ['Brian Galok','Ashish Mirji']
            },
            {
                semesterTitle: strings.SubTitle5,
                topPerformers: ['Michael Raman', 'Allen Jiang', 'Amadou Barry'],
                contributors: ['Roshni Dhanasekar','Sean Leary', 'Joseph Chiou', 'Sohail Mansuri', 'Jinghui Jiang', 'Anuradha Naik']
            },
            {
                semesterTitle: strings.SubTitle8,
                topPerformers: ['Brandon Caton'],
                contributors: ['Jonpierre Grajales']
            },
            {
                semesterTitle: strings.SubTitle9,
                topPerformers: ['Jerrod Ransom', 'Mateusz Stolarz'],
                contributors: ['Vaishnavi Reddy Adapala', 'Arun Somasundaram','Shantanu Sharma', 'Aravind Narayan','Zelin Chen']
            }
        ];

        return (
            <div className="about">
                <div className="pl-description">
                    <div className="section">
                        <h2 className="title">{strings.TitleString}</h2>
                        <div className="section-content">
                            <p>{strings.Sentence0}</p>
                            <br />
                            <p>{strings.Sentence1}</p>

                            <ul>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step0}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step1}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step2}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step3}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step4}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step5}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step6}</p></li>
                                <li><i className="fa fa-check icon" style={{paddingRight: 5}}></i><p>{strings.Step7}</p></li>
                            </ul>
                            <img src={'../../static/images/process-figure.png'} style={{width: '100%'}} />
                        </div>
                    </div>
                </div>
                <div className="developers-section">
                    <h2>{strings.SectionTitle0}</h2>
                    {
                        studentData.map( semesterData => {
                            const topPerformerList = semesterData.topPerformers.map(
                                student => <li><b style={{fontWeight: '600'}}>{student}</b></li>
                            );

                            const contributorList = semesterData.contributors.map(
                                student => <li>{student}</li>
                            );
                            return <div className="section">
                                <h2 className="title" style={{width: '75%'}}>{semesterData.semesterTitle}</h2>
                                <div className="section-content" >
                                    <ul>
                                        {topPerformerList}
                                        {contributorList}
                                    </ul>
                                </div>
                            </div>;
                        })
                    }
                </div>

                <div className="contact-section">
                    <h2>{strings.SectionTitle1}</h2>
                    <div className="section">
                        <h2 className="title" style={{width: '80%'}}>{strings.SubTitle6}</h2>
                        <div className="section-content">

                            <OrganizationSelector
                				key={1}
                			/>

                        </div>
                    </div>

                    <div className="section">
                        <h2 className="title" style={{width: '80%'}}>{strings.SubTitle7}</h2>
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
