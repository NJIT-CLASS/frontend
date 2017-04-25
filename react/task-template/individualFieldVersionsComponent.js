import React from 'react';
import Rater from 'react-rater';

class FieldVersionView extends React.Component{
    constructor(props){
        super(props);
    }
  // PROPS:
  //  Versions: [{}]
  //  Field: {}
  //  Strings: ['']
  //  FieldIndex: int
    render(){
        let rubricView = null;
        let instructions = null;
        let completeFieldView = null;
        let taskField = this.props.Field;
        let title = taskField.title;
        let fieldTitle = '';


        if(taskField.show_title){ // fieldTitle is shown next to the field, so only show if instructor sets show_title to true
            if(taskField.assessment_type != null){ //if it's  grade task, simply add 'Grade' to make it prettier
                fieldTitle = title + ' ' + this.props.Strings.Grade;
            }
            else{
                fieldTitle = title;
            }
        }

        let versions = this.props.Versions.map(function(versionArray, vIndex){

            let justification = null;
            let contentView = null;
            let fieldVersion = versionArray[this.props.FieldIndex];


            if(taskField.requires_justification){
                if(fieldVersion[1] == ''){
                    justification = (<div key={this.props.FieldIndex + vIndex + 655}></div>);
                }
                else{
                    justification = (<div key={this.props.FieldIndex + vIndex + 655} className="faded-big" dangerouslySetInnerHTML={{ __html: fieldVersion[1]}}></div>);
                }
            }

            let fieldContentBlock = null;
            switch(taskField.field_type){
            case 'assessment':
            case 'self-assessment':
                switch(taskField.assessment_type){
                case 'grade':
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-small"> {fieldVersion[0]}
                      </div>);
                    break;
                case 'rating':
                    let val = (fieldVersion[0] == null || fieldVersion[0] == '') ? 0 : fieldVersion[0];
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex + 600}><b>{fieldTitle}   </b>
                        <Rater total={taskField.rating_max} rating={val} interactive={false} />
                      </div>);
                    break;
                case 'pass':
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-small"> {fieldVersion[0]}</div>);
                    break;
                case 'evaluation':
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-big"> {fieldVersion[0]}
                    </div>);
                    break;
                default:
                    fieldContentBlock = (<div></div>);
                    break;
                }
                break;
            case 'text':
                fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-big" dangerouslySetInnerHTML={{ __html: fieldVersion[0]}}>
                </div>);
                break;
            case 'numeric':
                fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-small"> {fieldVersion[0]}
                </div>);
                break;
            default:
                fieldContentBlock = (<div></div>);
                break;

            }

            return <div className="version-block">
              {fieldContentBlock}
              <br key={this.props.FieldIndex + vIndex+500}/>
              {justification}
            </div>;

        }, this);

        completeFieldView =  (
          <div key={this.props.FieldIndex +200}>

            {instructions}
            {rubricView}
            <br/>
            {versions}
          </div>
          );

        return <div>{completeFieldView}</div>;
    }
}

export default FieldVersionView;
