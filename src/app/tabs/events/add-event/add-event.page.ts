import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  selectedFile: File | null = null;
  isEdit = false;
  filePreview: string | ArrayBuffer | null = null;

  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', Validators.maxLength(200)],
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    location: ['', Validators.required],
    eventType: ['', Validators.required],
    maxParticipants: ['', [Validators.required, Validators.min(1), Validators.max(1000), Validators.pattern('^[0-9]*$')]],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = new FormData();
      const eventData = this.eventForm.value;

      // Append form data
      for (const key in eventData) {
        if (eventData.hasOwnProperty(key)) {
          formData.append(key, (eventData as any)[key]);
        }
      }

      // Append file data
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      this.http.post('http://localhost:3000/events', formData).subscribe({
        next: response => {
          console.log('Event added successfully:', response);
          this.resetForm();
        },
        error: error => {
          console.error('Error adding event:', error);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  resetForm() {
    this.eventForm.reset();
    this.selectedFile = null;
    this.filePreview = null;
  }
}
