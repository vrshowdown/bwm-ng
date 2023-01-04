import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'bwm-editable',
    templateUrl: './editable.component.html',
    styleUrls: ['./editable.component.scss']
    })
export class EditableComponent implements OnChanges {

    @Input() entity: any;
    @Input() set field(entityField: string){
        this.entityField = entityField;
        this.setOriginValue();
    };
    @Input() className?: string;
    //input type removed 
    @Input() style: any;
    @Output() entityChange = new EventEmitter();

    isActiveInput: boolean = false;
    public entityField:any = String;
    public originEntityValue: any;

    constructor(){}
    
    ngOnChanges(){
        this.setOriginValue();
        this.isActiveInput = false;
    }

    updateEntity(){
        const entityValue = this.entity[this.entityField];

        if (entityValue !== this.originEntityValue) {
            this.entityChange.emit({[this.entityField]: this.entity[this.entityField]});
            this.setOriginValue();
        }
        this.isActiveInput = false;
    }

    cancelUpdate(){
        this.isActiveInput = false;
        this.entity[this.entityField] = this.originEntityValue;
    }

    setOriginValue(){
        this.originEntityValue = this.entity[this.entityField];
    }

}