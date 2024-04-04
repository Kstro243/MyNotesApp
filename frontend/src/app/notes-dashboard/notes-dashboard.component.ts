import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNoteDialogComponent } from '../add-note-dialog/add-note-dialog.component';
import { API_CategoryObject, API_NoteObject, API_ResponseObject, UI_IconButtonObject } from '../shared/interfaces/my-notes-app-interfaces';
import { NoteService } from '../shared/services/note/note.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../shared/services/authentication/authentication.service';
import { distinctUntilChanged } from 'rxjs';
import { LocalStorageService } from '../shared/services/localStorage/local-storage.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-notes-dashboard',
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss']
})
export class NotesDashboardComponent {
  isCharging: boolean = false;
  seeActive: boolean = true;
  showLoginForm: boolean = true;

  noteList: API_NoteObject[] = []
  listToShow: API_NoteObject[] = []
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
  iconButtonList: UI_IconButtonObject[] = []
  basicButtonList: UI_IconButtonObject[] = [
    {
      action: "Edit",
      show: true,
      icon: "edit"
    },
    {
      action: "Delete",
      show: true,
      icon: "delete"
    }
  ]
  archiveButton: UI_IconButtonObject = {
    action: "Archive",
    show: false,
    icon: "archive"
  }
  activeButton: UI_IconButtonObject = {
    action: "Unarchive",
    show: false,
    icon: "unarchive"
  }

  categoryFilter: FormControl;
  titleFilter: FormControl;
  descriptionFilter: FormControl;

  constructor(
    private _authService: AuthenticationService,
    private _dialog: MatDialog,
    private _localStorageService: LocalStorageService,
    private _noteService: NoteService,
    private _snackBar: MatSnackBar
  ) {
    this.categoryFilter = new FormControl<string>("");
    this.titleFilter = new FormControl<string>("");
    this.descriptionFilter = new FormControl<string>("");

    this.categoryFilter.valueChanges.subscribe((value: API_CategoryObject) => {
      if(value != null) {
        this.filterByCategoryId(value?.id);
        this.titleFilter.setValue(null, { emitEvent: false })
        this.descriptionFilter.setValue(null, { emitEvent: false })
      }
    })
    this.titleFilter.valueChanges.subscribe((value: string) => {
      if(value != null) {
        this.filterByTitle(value)
        this.categoryFilter.setValue(null, { emitEvent: false })
        this.descriptionFilter.setValue(null, { emitEvent: false })
      }
    })
    this.descriptionFilter.valueChanges.subscribe((value: string) => {
      if(value != null) {
        this.filterByDescription(value)
        this.titleFilter.setValue(null, { emitEvent: false })
        this.categoryFilter.setValue(null, { emitEvent: false })
      }
    })
    if(this.isTokenValid()) {
      this._authService.changeUserLoggedStatus(true);
    }
    this._authService.isUserLoged$.pipe(distinctUntilChanged()).subscribe((userLoggedStatus) => {
      if(userLoggedStatus) {       
        this.showLoginForm = false;
        this.getNotes();
      }
    })
  }
  isTokenValid(): boolean {
    const token: string = this._localStorageService.getToken();
    if(token === null || token === "") {
      return false
    }
    const now = new Date();
    const decodedToken = jwt_decode(token) as any;
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);
    
    return now < expirationDate
  } 

  clearTitleFilter() {
    this.titleFilter.patchValue(null);
    this.listToShow = this.noteList
  }
  clearDescriptionFilter() {
    this.descriptionFilter.patchValue(null);
    this.listToShow = this.noteList
  }
  clearCategoryFilter() {
    this.categoryFilter.patchValue(null);
    this.listToShow = this.noteList
  }

  filterByCategoryId(categoryId: number) {
    this.listToShow = this.noteList.filter(
      (note) => note.categoryId == categoryId
    )
  }

  filterByTitle(title: string) {
    this.listToShow = this.noteList.filter(
      (note) => note.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
    )
  }

  filterByDescription(description: string) {
    this.listToShow = this.noteList.filter(
      (note) => note.description.toLocaleLowerCase().includes(description.toLocaleLowerCase())
    )
  }

  iconButtonAction(
    note: API_NoteObject,
    iconButton: UI_IconButtonObject
  ): void {
    switch (iconButton.action) {
      case "Edit":
        this.editNote(note);
        break;
      case "Delete":
        this.deleteNote(note);
        break;
      case "Archive":
        this.changeNoteStatus(note);
        break;
      case "Unarchive":
        this.changeNoteStatus(note);
        break;
      default:
        break;
    }
  }

  getNotes(): void {
    this.isCharging = true;
    this._noteService.getAll().subscribe({
      next: (response: API_ResponseObject<API_NoteObject[]>) => {
        if(response.data) {
          this.noteList = response.data
          this.listToShow = response.data
          this.setButtonsList();
        } else {
          this.openSnackbar(response.message);
        }
        this.isCharging = false;
      }, error: () => {
        this.isCharging = false;
      }
    })
  }

  createNote(): void {
    const openDialog = this._dialog.open(AddNoteDialogComponent);
    openDialog.afterClosed().subscribe((newNote: API_NoteObject) => {
      if(newNote) {
        this.isCharging = true;
        this._noteService.create(newNote).subscribe({
          next: (response: API_ResponseObject<API_NoteObject>) => {
            this.getNotes();
            this.openSnackbar(response.message);
          }, error: () => {
            this.openSnackbar("There has been an error, please try again...")
            this.isCharging = false;
          }
        })
      }
    })
  }
  editNote(noteToEdit: API_NoteObject): void {
    const openDialog = this._dialog.open(AddNoteDialogComponent, {
      data: noteToEdit
    });
    openDialog.afterClosed().subscribe((newNote: API_NoteObject) => {
      if(newNote) {
        this.isCharging = true;
        this._noteService.edit(newNote).subscribe({
          next: (response: API_ResponseObject<API_NoteObject>) => {
            this.getNotes();
            this.openSnackbar(response.message);
          }, error: () => {
            this.openSnackbar("There has been an error, please try again...")
            this.isCharging = false;
          }
        })
      }
    })
  }
  deleteNote(noteToDelete: API_NoteObject): void {
    const noteToDeleteId: number = noteToDelete.id ?? 0;
    this.isCharging = true;
    this._noteService.delete(noteToDeleteId).subscribe({
      next: (response: API_ResponseObject<API_NoteObject>) => {
        this.getNotes();
        this.openSnackbar(response.message);
      }, error: () => {
        this.openSnackbar("There has been an error, please try again...")
        this.isCharging = false;
      }
    })
  }
  changeNoteStatus(noteToEdit :API_NoteObject): void {
    const noteToEditId: number = noteToEdit.id ?? 0;
    this.isCharging = true;
    this._noteService.changeState(noteToEditId).subscribe({
      next: (response: API_ResponseObject<API_NoteObject>) => {
        this.getNotes();
        this.openSnackbar(response.message);
      }, error: () => {
        this.openSnackbar("There has been an error, please try again...")
        this.isCharging = false;
      }
    })
  }

  setButtonsList(): void {
    if(this.seeActive) {
      this.iconButtonList = [... this.basicButtonList, this.archiveButton]
    } else {
      this.iconButtonList = [... this.basicButtonList, this.activeButton]
    }
  }
  toggleSeeActive() {
    this.seeActive = !this.seeActive;
    this.setButtonsList();
  }
  openSnackbar(message: string) {    
    this._snackBar.open(
      message, 
      "",
      {
        panelClass: ['snackbar-styles']
      }
    );
  }

  setLoader(state: boolean) {
    this.isCharging = state
  }
}
