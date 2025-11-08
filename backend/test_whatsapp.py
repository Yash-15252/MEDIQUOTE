#!/usr/bin/env python
"""
Test script for WhatsApp notifications
Run this script to test WhatsApp message sending functionality
"""
import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from quotes.signals import send_whatsapp_message

def test_whatsapp_notification():
    """
    Test sending a WhatsApp message
    """
    print("Testing WhatsApp notification...")

    # Test message
    test_message = "Test notification from MEDIQUOTE system!\nThis is a test message to verify WhatsApp integration."

    # Get phone number from settings
    phone_numbers = getattr(settings, 'NOTIFICATION_PHONE_NUMBERS', [])
    if not phone_numbers:
        print("No phone numbers configured in settings. Please set NOTIFICATION_PHONE_NUMBERS.")
        return

    # Send test message to first configured number
    test_phone = phone_numbers[0]
    print(f"Sending test message to: {test_phone}")

    try:
        send_whatsapp_message(test_phone, test_message)
        print("Test message sent successfully!")
    except Exception as e:
        print(f"Error sending test message: {e}")
        print("Make sure your Twilio credentials are properly configured.")

if __name__ == "__main__":
    test_whatsapp_notification()
