
import os
import aiosmtplib
from email.message import EmailMessage
from typing import List
import logging
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Configuración SMTP (variables de entorno)
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@therian-go.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

class EmailService:
    @staticmethod
    async def send_email(
        to_emails: List[str],
        subject: str,
        html_content: str,
        text_content: str = None
    ) -> bool:
        
        if not SMTP_USER or not SMTP_PASSWORD:
            logger.error("SMTP no configurado. Las variables de entorno faltan.")
            return False
        
        message = EmailMessage()
        message["From"] = FROM_EMAIL
        message["To"] = ", ".join(to_emails)
        message["Subject"] = subject
        
        # Versión texto plano (fallback)
        if text_content:
            message.set_content(text_content)
        
        # Versión HTML
        message.add_alternative(html_content, subtype="html")
        
        try:
            await aiosmtplib.send(
                message,
                hostname=SMTP_HOST,
                port=SMTP_PORT,
                username=SMTP_USER,
                password=SMTP_PASSWORD,
                use_tls=False,  # STARTTLS
                start_tls=True
            )
            logger.info(f"Email enviado a {to_emails}")
            return True
        except Exception as e:
            logger.error(f"Error enviando email: {e}")
            return False
    
    @staticmethod
    async def send_password_reset(email: str, token: str, username: str):
        """Envía email de recuperación de contraseña"""
        reset_link = f"{FRONTEND_URL}/reset-password?token={token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Recuperación de contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333;">¡Hola {username}!</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña en Therian GO.</p>
                <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
                <p style="text-align: center;">
                    <a href="{reset_link}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;">
                        Restablecer contraseña
                    </a>
                </p>
                <p>Este enlace expirará en <strong>24 horas</strong>.</p>
                <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                <hr>
                <p style="color: #777; font-size: 12px;">
                    Therian GO - Un espacio seguro para la comunidad Therian
                </p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        ¡Hola {username}!
        
        Recibimos una solicitud para restablecer tu contraseña en Therian GO.
        
        Haz clic en el siguiente enlace para crear una nueva contraseña:
        {reset_link}
        
        Este enlace expirará en 24 horas.
        
        Si no solicitaste este cambio, ignora este mensaje.
        
        Therian GO - Un espacio seguro para la comunidad Therian
        """
        
        return await EmailService.send_email(
            to_emails=[email],
            subject="Recuperación de contraseña - Therian GO",
            html_content=html_content,
            text_content=text_content
        )