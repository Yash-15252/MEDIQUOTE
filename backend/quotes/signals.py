from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Bid, RFQ
from twilio.rest import Client
from django.conf import settings
import os

def send_whatsapp_message(to, message):
    """
    Send WhatsApp message using Twilio API
    """
    try:
        account_sid = os.getenv('TWILIO_ACCOUNT_SID') or settings.TWILIO_ACCOUNT_SID
        auth_token = os.getenv('TWILIO_AUTH_TOKEN') or settings.TWILIO_AUTH_TOKEN
        whatsapp_number = os.getenv('TWILIO_WHATSAPP_NUMBER') or settings.TWILIO_WHATSAPP_NUMBER

        if not all([account_sid, auth_token, whatsapp_number]):
            print("Twilio credentials not configured. Skipping WhatsApp notification.")
            return

        client = Client(account_sid, auth_token)

        message = client.messages.create(
            from_=whatsapp_number,
            body=message,
            to=f'whatsapp:{to}'
        )
        print(f"WhatsApp message sent: {message.sid}")
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")

@receiver(post_save, sender=Bid)
def notify_new_bid(sender, instance, created, **kwargs):
    """
    Send WhatsApp notification when a new bid is submitted
    """
    if created:
        message = f"New bid received!\nRFQ: {instance.rfq.item}\nSupplier: {instance.supplier.name}\nPrice: ₹{instance.price}\nQuantity: {instance.rfq.quantity}"

        # Send to all configured phone numbers
        notification_numbers = getattr(settings, 'NOTIFICATION_PHONE_NUMBERS', [])
        for phone in notification_numbers:
            send_whatsapp_message(phone, message)

@receiver(post_save, sender=RFQ)
def notify_new_rfq(sender, instance, created, **kwargs):
    """
    Send WhatsApp notification when a new RFQ is created
    """
    if created:
        message = f"New RFQ Created!\nItem: {instance.item}\nQuantity: {instance.quantity}\nDeadline: {instance.deadline}\nPlease submit your competitive bids!"

        # Send to all configured phone numbers
        notification_numbers = getattr(settings, 'NOTIFICATION_PHONE_NUMBERS', [])
        for phone in notification_numbers:
            send_whatsapp_message(phone, message)
