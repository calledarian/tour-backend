import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { Bookings } from 'src/bookings/bookings.entity';

@Injectable()
export class MailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendBookingReceivedEmail(booking: Bookings) {
        try {
            const tourDate = new Date(booking.tourDate);
            const formattedDate = isNaN(tourDate.getTime()) ? 'Invalid date' : tourDate.toLocaleDateString();

            const emailBody = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank you for your booking, ${booking.name}!</h2>
        <p>We received your request.</p>
        <p><strong>Your Booking Reference:</strong> ${booking.referenceCode}</p>
        <p>Please keep this code safe. We will use it to confirm your payment.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tbody>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Tour ID</td>
              <td style="padding: 8px;">${booking.tourId}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Number of People</td>
              <td style="padding: 8px;">${booking.people}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Phone</td>
              <td style="padding: 8px;">${booking.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email</td>
              <td style="padding: 8px;">${booking.email}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Notes</td>
              <td style="padding: 8px;">${booking.notes || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Booking Date</td>
              <td style="padding: 8px;">${formattedDate}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Total Price</td>
              <td style="padding: 8px;">$${booking.totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 20px;">We look forward to serving you soon!</p>
      </div>
    `;

            await this.resend.emails.send({
                from: 'Ramboda Tours <onboarding@resend.dev>',
                to: booking.email,
                subject: 'Thank you for your booking!',
                html: emailBody,
            });

            console.log('Booking confirmation email sent successfully');
        } catch (error) {
            console.error('Error sending booking confirmation email:', error);
        }
    }


    async sendBookingConfirmedEmail(booking: Bookings) {
        try {
            const html = `
        <h2>Your booking is confirmed, ${booking.name}!</h2>
        <p>✅ Booking Reference: <strong>${booking.referenceCode}</strong></p>
        <p>Use this code to verify your booking or communicate with us.</p>

        <p><strong>Tour ID:</strong> ${booking.tourId}</p>
        <p><strong>Number of People:</strong> ${booking.people}</p>

        <h3>Payment Instructions:</h3>
        <p><strong>Bank Transfer:</strong> XYZ Bank - Account No. 123456789</p>
        <p><strong>PayPal:</strong> <a href="https://paypal.me/example">paypal.me/example</a></p>

        <hr />
        <p style="color:red;">⚠️ Only trust emails that include your exact reference code.</p>
        <p>If someone asks for payment without this code, it's a scam.</p>

        <p>Need help? Contact us anytime at <a href="mailto:info@rambodatours.com">info@rambodatours.com</a> or +94 712 345 678.</p>

      `;

            await this.resend.emails.send({
                from: 'Ramboda Tours <onboarding@resend.dev>',
                to: booking.email,
                subject: 'Your booking is confirmed!',
                html,
            });

            console.log('Booking confirmed email sent successfully');
        } catch (error) {
            console.error('Error sending booking confirmed email:', error);
        }
    }
}
