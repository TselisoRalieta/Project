import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashbourd',
    loadChildren: () => import('./dashbourd/dashbourd.module').then( m => m.DashbourdPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'profile-details',
    loadChildren: () => import('./profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule)
  },
  {
    path: 'admin-menu',
    loadChildren: () => import('./admin-menu/admin-menu.module').then( m => m.AdminMenuPageModule)
  },
  {
    path: 'admin-account',
    loadChildren: () => import('./admin-account/admin-account.module').then( m => m.AdminAccountPageModule)
  },
  {
    path: 'contact-center',
    loadChildren: () => import('./contact-center/contact-center.module').then( m => m.ContactCenterPageModule)
  },
  {
    path: 'about-us',
    loadChildren: () => import('./about-us/about-us.module').then( m => m.AboutUsPageModule)
  },
  {
    path: 'updates',
    loadChildren: () => import('./updates/updates.module').then( m => m.UpdatesPageModule)
  },
  {
    path: 'road-safety',
    loadChildren: () => import('./road-safety/road-safety.module').then( m => m.RoadSafetyPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'weather',
    loadChildren: () => import('./weather/weather.module').then( m => m.WeatherPageModule)
  },
  {
    path: 'road-status',
    loadChildren: () => import('./road-status/road-status.module').then( m => m.RoadStatusPageModule)
  },
  {
    path: 'report',
    loadChildren: () => import('./report/report.module').then( m => m.ReportPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'create-account',
    loadChildren: () => import('./create-account/create-account.module').then( m => m.CreateAccountPageModule)
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then( m => m.BlogPageModule)
  },  {
    path: 'weather-admin',
    loadChildren: () => import('./weather-admin/weather-admin.module').then( m => m.WeatherAdminPageModule)
  },
  {
    path: 'call-center',
    loadChildren: () => import('./call-center/call-center.module').then( m => m.CallCenterPageModule)
  },
  {
    path: 'tips',
    loadChildren: () => import('./tips/tips.module').then( m => m.TipsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'emergency',
    loadChildren: () => import('./emergency/emergency.module').then( m => m.EmergencyPageModule)
  },
  {
    path: 'awareness',
    loadChildren: () => import('./awareness/awareness.module').then( m => m.AwarenessPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
