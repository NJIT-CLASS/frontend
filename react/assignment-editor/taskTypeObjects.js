
  switch(TA_type){
    case TASK_TYPES.CREATE_PROBLEM:
      break;
    case TASK_TYPES.EDIT:
    case TASK_TYPES.COMMENT:
      break;
    case TASK_TYPES.SOLVE_PROBLEM:
      break;
    case TASK_TYPES.GRADE_PROBLEM:
      break;
    default:
      break;
  }

  return ;
}



// this function cusotmizes the generic task tempate above to the type of task it needs;

    let newTask = {
        TA_display_name: '',
        TA_type: '',
        TA_documentation:'',
        TA_name: '',
        TA_overall_instructions: '',
        TA_overall_rubric: '',
        SimpleGradePointReduction: 0,
        AllowConsolidations: [
            false, false
        ],
        StartDelay: false,
        TA_file_upload: [
            [
                0, "mandatory"
            ],
            [0, 'optional']
        ],
        TA_due_type: [
            'duration', 4320
        ],
        TA_start_delay: 0,
        TA_at_duration_end: 'late',
        TA_what_if_late: 'keep_same_participant',

        TA_one_or_separate: false,
        TA_assignee_constraints: [
            '', '', {}
        ],
        TA_simple_grade: 'none',
        TA_is_final_grade: false,

        TA_allow_reflection: [
            'none', "don't wait"
        ],
        TA_allow_assessment: 'none',
        TA_allow_revisions: false,
        TA_number_participant: 1,
        TA_function_type: 'max',
        TA_allow_dispute: false,
        TA_trigger_consolidation_threshold: [],
        TA_leads_to_new_problem: false,
        TA_leads_to_new_solution: false,
        TA_visual_id: '',
        TA_fields: {
            number_of_fields: 1,
            field_titles: ['Field'],
            0: {
               title: 'Field',
               show_title: false,
               assessment_type: null,
               numeric_min: 0,
               numeric_max: 40,
               rating_max: 5,
               list_of_labels: 'Easy, Medium, Difficult',
               field_type: "text",
               requires_justification: false,
               instructions: "",
               rubric: '',
               justification_instructions: '',
               default_refers_to: [
                   null, null
               ],
               default_content: ['', '']
            }
        }
    };


    this.solveProblemTask = createTaskObject(TASK_TYPES.SOLVE_PROBLEM, TASK_TYPE_TEXT.solve_problem, 'Solve the Problem', 'late', 'keep_same_participant', [
        'student',
        'individual', {}
    ], false, 1, []);

    this.gradeSolutionTask = createTaskObject(TASK_TYPES.GRADE_PROBLEM, TASK_TYPE_TEXT.grade_problem, 'Grade the Solution', 'late', 'keep_same_participant', [
        'student',
        'individual', {}
    ], true, 2, []);

    this.critiqueSolutionTask = createTaskObject(TASK_TYPES.CRITIQUE, TASK_TYPE_TEXT.critique, 'Critique the Solution', 'late', 'keep_same_participant', [
        'student',
        'individual', {}
    ], true, 2, []);

    this.needsConsolidationTask = createTaskObject(TASK_TYPES.NEEDS_CONSOLIDATION, TASK_TYPE_TEXT.needs_consolidation, 'Needs Consolidation', null, null, [
        'student', 'individual', {}
    ], true, 1, []);

    this.consolidationTask = createTaskObject(TASK_TYPES.CONSOLIDATION, TASK_TYPE_TEXT.consolidation, 'Consolidate', 'late', 'keep_same_participant', [
        'student',
        'individual', {}
    ], true, 1, []);

    this.disputeTask = createTaskObject(TASK_TYPES.DISPUTE, TASK_TYPE_TEXT.dispute, 'Dispute the Grades', 'resolved', null, [
        'student',
        'individual', {}
    ], false, 1, []);

    this.resolveDisputeTask = createTaskObject(TASK_TYPES.RESOLVE_DISPUTE, TASK_TYPE_TEXT.resolve_dispute, 'Resolve the Dispute', 'late', 'keep_same_participant', [
        'student',
        'individual', {}
    ], true, 1, []);

    this.completeTask = createTaskObject(TASK_TYPES.COMPLETED, TASK_TYPE_TEXT.completed, 'Complete', null, null, [
        'student', 'individual', {'same_as': [2]}
    ], false, 1, []);
