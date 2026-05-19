package com.menuharian.app;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import androidx.core.app.NotificationCompat;

public class AlarmReceiver extends BroadcastReceiver {
  @Override
  public void onReceive(Context context, Intent intent) {
    String channelId = "default";

    // Mengambil data teks dinamis yang dikirim saat alarm disetel
    String title = intent.getStringExtra("notification_title");
    String message = intent.getStringExtra("notification_message");

    // Jika data kosong, gunakan teks default agar aman
    if (title == null || title.isEmpty()) {
      title = "Waktunya Makan!";
    }
    if (message == null || message.isEmpty()) {
      message = "Cek menu harianmu sekarang.";
    }

    Intent notificationIntent = new Intent(context, MainActivity.class);
    notificationIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);

    PendingIntent pendingIntent = PendingIntent.getActivity(
      context,
      (int) System.currentTimeMillis(), // Menggunakan milidetik agar requestCode unik
      notificationIntent,
      PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
    );

    NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
      // 1. Mengarah ke asset ikon notifikasi transparan yang baru dibuat
      .setSmallIcon(R.drawable.ic_stat_name)

      // 2. Ikon besar di sebelah kanan saat notifikasi ditarik ke bawah (menggunakan ikon aplikasi)
      .setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher))

      .setContentTitle(title)
      .setContentText(message)
      .setPriority(NotificationCompat.PRIORITY_HIGH) // Memastikan notifikasi melayang di layar (Heads-up)
      .setContentIntent(pendingIntent)
      .setAutoCancel(true);

    NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

    if (notificationManager != null) {
      // Menggunakan ID unik berbasis waktu agar notifikasi tidak saling menimpa saat muncul bersamaan
      int notificationId = (int) System.currentTimeMillis();
      notificationManager.notify(notificationId, builder.build());
    }
  }
}
