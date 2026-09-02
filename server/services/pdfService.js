/**
 * Quote PDF Generator Service for Lumina Window Treatments
 */
export function generateQuotePdf(quote, customer) {
  // Generate a structured printable PDF HTML / Data URI
  const formattedDate = new Date(quote.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const pdfHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Quote #${quote.id.slice(0, 8)} - Lumina Window Treatments</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #252525; padding: 40px; margin: 0; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #596052; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #252525; }
        .sublogo { font-size: 14px; color: #596052; text-transform: uppercase; letter-spacing: 1px; }
        .quote-info { text-align: right; }
        .details-grid { display: flex; justify-content: space-between; margin: 30px 0; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th { background: #f7f5f0; padding: 12px; text-align: left; border-bottom: 2px solid #e0e0e0; }
        .table td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        .totals { margin-top: 30px; margin-left: auto; width: 300px; }
        .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .totals-row.grand { font-size: 18px; font-weight: bold; border-top: 2px solid #252525; padding-top: 12px; }
        .guarantee { background: #f7f5f0; padding: 15px; border-radius: 6px; margin-top: 40px; font-size: 12px; color: #555; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Lumina</div>
          <div class="sublogo">Custom Window Treatments • Gaithersburg, MD</div>
          <p style="font-size: 13px; color: #666; margin: 5px 0;">Serving DC, Maryland & Northern Virginia • (800) 555-0199</p>
        </div>
        <div class="quote-info">
          <h2 style="margin: 0; color: #596052;">OFFICIAL ESTIMATE</h2>
          <p style="margin: 5px 0; font-weight: bold;">Quote #${quote.id.slice(0, 8)}</p>
          <p style="margin: 5px 0; color: #666;">Date: ${formattedDate}</p>
        </div>
      </div>

      <div class="details-grid">
        <div>
          <h4 style="margin: 0 0 8px 0; color: #777; text-transform: uppercase; font-size: 12px;">Prepared For:</h4>
          <p style="margin: 2px 0; font-weight: bold;">${customer?.name || customer?.first_name ? `${customer.first_name} ${customer.last_name || ''}` : 'Valued Customer'}</p>
          <p style="margin: 2px 0; color: #555;">${customer?.address || 'Service Address On File'}</p>
          <p style="margin: 2px 0; color: #555;">${customer?.phone || ''} • ${customer?.email || ''}</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Item / Description</th>
            <th>Qty</th>
            <th>Specs</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${quote.product_type}</strong><br>
              <span style="font-size: 12px; color: #666;">Custom fabricated to exact laser measurements. Cordless safety mechanism.</span>
            </td>
            <td>${quote.window_count}</td>
            <td>${quote.width ? `${quote.width}"W × ${quote.height}"H` : 'Custom Sized'}</td>
            <td style="text-align: right;">$${Number(quote.unit_price).toFixed(2)}</td>
            <td style="text-align: right;">$${Number(quote.total_price).toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="4" style="color: #666; font-size: 13px;">Professional Laser In-Home Measurement</td>
            <td style="text-align: right; color: #2e7d32; font-weight: bold;">INCLUDED ($0.00)</td>
          </tr>
          <tr>
            <td colspan="4" style="color: #666; font-size: 13px;">White-Glove Master Installation & Hardware Mounting</td>
            <td style="text-align: right; color: #2e7d32; font-weight: bold;">INCLUDED ($0.00)</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>$${Number(quote.total_price).toFixed(2)}</span>
        </div>
        <div class="totals-row">
          <span>Sales Tax & Delivery:</span>
          <span>$0.00</span>
        </div>
        <div class="totals-row grand">
          <span>Total Project Price:</span>
          <span>$${Number(quote.total_price).toFixed(2)}</span>
        </div>
        <div class="totals-row" style="color: #596052; font-weight: bold; margin-top: 8px;">
          <span>50% Required Deposit:</span>
          <span>$${Number(quote.deposit_amount).toFixed(2)}</span>
        </div>
        <div class="totals-row" style="color: #666;">
          <span>Balance upon Completion:</span>
          <span>$${Number(quote.balance_due).toFixed(2)}</span>
        </div>
      </div>

      <div class="guarantee">
        <strong>The Lumina Perfect-Fit Guarantee:</strong> Since our licensed technicians measure your windows, we guarantee a 100% precision fit. If any treatment does not fit perfectly, we will remake it at zero charge. All mechanical components are backed by our Limited Lifetime Craftsmanship Warranty.
      </div>
    </body>
    </html>
  `;

  // Return a web-viewable data URL
  return `data:text/html;charset=utf-8,${encodeURIComponent(pdfHtml)}`;
}
