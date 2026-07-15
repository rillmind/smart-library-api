import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService, Language } from '../../core/services/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  translationService = inject(TranslationService);

  settingsForm = this.fb.group({
    theme: ['light', [Validators.required]],
    language: ['pt-BR', [Validators.required]],
    emailNotifications: [true],
    dueAlerts: [true],
    alertFrequency: ['weekly', [Validators.required]],
  });

  ngOnInit(): void {
    this.settingsForm.reset({
      theme: localStorage.getItem('theme') || 'light',
      language: localStorage.getItem('language') || 'pt-BR',
      emailNotifications: localStorage.getItem('emailNotifications') !== 'false',
      dueAlerts: localStorage.getItem('dueAlerts') !== 'false',
      alertFrequency: localStorage.getItem('alertFrequency') || 'weekly',
    });
  }

  onSave(): void {
    if (this.settingsForm.invalid) return;

    const formValue = this.settingsForm.getRawValue();
    const theme = formValue.theme || 'light';
    const language = (formValue.language || 'pt-BR') as Language;

    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
    localStorage.setItem('emailNotifications', String(formValue.emailNotifications));
    localStorage.setItem('dueAlerts', String(formValue.dueAlerts));
    localStorage.setItem('alertFrequency', formValue.alertFrequency || 'weekly');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }

    this.translationService.setLanguage(language);

    this.snackBar.open(
      language === 'en'
        ? 'Settings saved successfully!'
        : language === 'es'
        ? '¡Configuraciones guardadas con éxito!'
        : 'Configurações salvas com sucesso!',
      'Fechar',
      {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      }
    );
  }
}
