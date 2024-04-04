import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { API_CategoryObject, API_NoteObject } from '../shared/interfaces/my-notes-app-interfaces';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss'],
})
export class AddNoteDialogComponent {
  noteToEdit: API_NoteObject;
  isEditMode: boolean;

  titleField: FormControl
  descriptionField: FormControl
  categoryField: FormControl
  wantToArchive: FormControl;

  categoryList: API_CategoryObject[] = [
    {
      id: 1,
      name: "Urgent"
    },
    {
      id: 2,
      name: "Pending"
    },
    {
      id: 3,
      name: "Done"
    },
  ]
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: API_NoteObject,
    private _dialog: MatDialogRef<API_NoteObject>
  ) {
    this.noteToEdit = this._data ?? null;
    this.isEditMode = this._data === null ? false : true;

    this.titleField = new FormControl<string>("" , [Validators.required, Validators.maxLength(45)])
    this.descriptionField = new FormControl<string>("" , [Validators.required, Validators.maxLength(400)])
    this.categoryField = new FormControl<API_CategoryObject | null>(null , [Validators.required])
    this.wantToArchive = new FormControl<boolean>(false , [Validators.required])

    if(this.isEditMode) {
      this.setFields();
    }
  }
  setFields() {
    this.titleField.patchValue(this.noteToEdit.title);
    this.descriptionField.patchValue(this.noteToEdit.description);
    this.categoryField.patchValue(this.noteToEdit.category);
    this.wantToArchive.patchValue(!this.noteToEdit.isActive);
  }
  displayCategoryName(
    category1: API_CategoryObject,
    category2: API_CategoryObject
  ): boolean {
    return category1 && category2
      ? category1.name === category2.name
      : category1 === category2;
  }
  clearTitleField() {
    this.titleField.patchValue(null);
  }
  clearDescriptionField() {
    this.descriptionField.patchValue(null);
  }
  clearCategoryField() {
    this.categoryField.patchValue(null);
  }
  saveChanges() {
    const id: number = this.noteToEdit?.id ?? 0;
    const title: string = this.titleField.value ?? "";
    const description: string = this.descriptionField.value ?? "";
    const categoryId: number = this.categoryField.value?.id ?? 0;
    const isActive: boolean = !this.wantToArchive.value;

    const noteToSave: API_NoteObject = {
      id,
      title,
      description,
      categoryId,
      isActive
    }

    this._dialog.close(noteToSave);
  }
}
