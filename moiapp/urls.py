from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [

    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),  
    path('amr/', views.amr, name='amr'),  
    path('facedetection/', views.facedetection, name='facedetection'),  
 
    path('drone/', views.drone, name='drone'),  
    path('addface/', views.addface, name='addface'),  
    path('signin/', views.signin_view, name='signin_view'),
    path('signup/', views.signup, name='signup'),
    path('signout/', views.signout, name='signout'),
    path('createUser/', views.create_user_view, name='create_user_view'),
    path('employees/', views.get_employee_info, name='get_employee_info'),
    path('amr_front/', views.amr_front, name='amr_front'),
    path('amr_back/', views.amr_back, name='amr_back'),
    path('run_face_detection/', views.run_face_detection, name='run_face_detection'),
    path('scan_face_result/', views.scan_face_result, name='scan_face_result'),
    
     path('facestatus_count/', views.facestatus_count, name='facestatus_count'),
     path('wrongparking/', views.wrongparking, name='wrongparking'),
     path('carplate/', views.carplate, name='carplate'),
     path('dashboard_data/', views.dashboard_data, name='dashboard_data'),
     path('dashboard_trafic/', views.dashboard_trafic, name='dashboard_trafic'),
     path('dashboard_latest_records/', views.dashboard_latest_records, name='dashboard_latest_records'),
     path('save_emp_image/', views.save_emp_image, name='save_emp_image'),
     path('drone_trafic/', views.drone_trafic, name='drone_trafic'),
     path('update_settings/<str:direction>/', views.update_settings, name='update_settings'),
     path('add-drone/', views.add_drone, name='add-drone'),
    # Dania's urls
    path('video_feed_html/', views.video_feed_html, name='video_feed_html'),
    path('get_value/', views.get_value, name='get_value'),
    path('turn_on/', views.turn_on, name='turn_on'),
    path('turn_off/', views.turn_off, name='turn_off')
    # path('update_theme/<str:newtheme>/', views.update_theme, name='update_theme'),
]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)