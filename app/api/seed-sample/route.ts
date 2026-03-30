import { NextResponse } from "next/server";
import { addNewsletters, getAll } from "@/lib/newsletters-store";

const SAMPLE_TITLE = "UK Transparency Rules Expose 32K Offshore London Properties";

const SAMPLE_BODY = `
<h1 style="color:#1a1a2e;font-family:Georgia,serif;font-size:28px;border-bottom:2px solid #c9a84c;padding-bottom:8px;">🌍 Global Property Intelligence</h1>
<h3 style="color:#2c3e6b;font-family:Georgia,serif;font-size:17px;margin-top:24px;">Saturday, March 28, 2026</h3>
<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>

<h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;margin-top:32px;">FROM THE EDITOR'S DESK</h2>
<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">Today's edition pulls back the curtain on one of the most consequential — and least discussed — dimensions of African elite wealth: the scale of offshore property holdings in London, and the new transparency laws that are beginning to expose them. For diaspora investors who have long operated in the same markets as these ultra-high-net-worth figures, understanding how ownership structures are shifting under UK regulatory pressure is no longer optional — it is essential due diligence. The Wigwe story is a lens into a much larger transformation of how London property is owned, disclosed, and ultimately contested.</p>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>

<h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;margin-top:32px;">🇬🇧 UNITED KINGDOM | RESIDENTIAL REAL ESTATE &amp; OFFSHORE OWNERSHIP TRANSPARENCY</h2>
<h3 style="color:#2c3e6b;font-family:Georgia,serif;font-size:17px;margin-top:24px;">Report Links Herbert Wigwe to 106 London Homes — Ranks 7th Among Global Billionaire Owners</h3>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;"><strong style="color:#1a1a2e;">A new investigative report has revealed that the late Nigerian banking titan Herbert Wigwe was linked to 106 properties across London, placing him seventh on a global list of billionaires with the largest offshore real estate footprints in the British capital.</strong></p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">An investigation by <em>The Londoner</em>, published in its report titled <em>"Revealed: The Billionaires Who Really Own London,"</em> examined more than 32,000 properties held through overseas entities across the city. Wigwe — who served as Group Chief Executive of Access Holdings Plc until his death on February 9, 2024, in a helicopter crash near the Nevada border — appeared on the list alongside other international figures including John Corless, Sarah Bard, Simon Reuben, Alexander Bard, Rit Thirakomen, and Wolfgang Peter Egger.</p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">The mechanism behind this disclosure is structural and legal: recent changes to UK law now require foreign companies to reveal their true beneficial owners — a reform specifically designed to dismantle the opacity that has long characterised London's high-end property market. The investigation found that 2,224 high-value properties were traced to firms registered in St Helier, Jersey alone. As <em>The Londoner</em> noted: <em>"This investigation lifts the veil on who really owns large parts of London."</em></p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">For diaspora investors — particularly Nigerians and West Africans with existing or planned exposure to London real estate — this story carries immediate compliance and strategic implications. Investors who have structured holdings through Jersey, the British Virgin Islands, or similar jurisdictions must now ensure their beneficial ownership registers are accurately filed with the UK's Register of Overseas Entities (ROE), or face restrictions on selling, transferring, or mortgaging their assets.</p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;"><strong style="color:#1a1a2e;">Source:</strong> <a href="https://businessday.ng/life-arts/article/report-links-herbert-wigwe-to-106-london-homes-ranks-7th-among-global-billionaire-owners/" style="color:#2c3e6b;text-decoration:underline;">BusinessDay Nigeria, March 27, 2026</a></p>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>

<h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;margin-top:32px;">📊 MARKET CONTEXT</h2>
<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">The scale of offshore ownership in London's property market is staggering, and the Wigwe case is just one data point within a much larger systemic picture. <em>The Londoner's</em> investigation covered more than 32,000 properties held through overseas entities — a figure that represents only the portion now visible under the new disclosure regime. The 2,224 properties traced specifically to Jersey-registered firms illustrates how a single small jurisdiction has functioned as the structural backbone of elite London property ownership for decades.</p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">London remains one of the world's most sought-after real estate markets for African high-net-worth individuals, with Nigerian buyers historically among the most active non-European purchasers of prime Central London property. Average values in prime London postcodes — Mayfair, Knightsbridge, Belgravia — continue to hold above £2,000 per square foot. For context, 106 properties at even conservative average values of £500,000 each would represent a portfolio worth in excess of £53 million.</p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">Investors should watch closely over the next 30–90 days for UK government enforcement actions against non-compliant overseas entities, as well as any secondary market movement in prime London properties as offshore owners — facing new disclosure obligations — choose to liquidate rather than register.</p>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>

<h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;margin-top:32px;">🌐 CROSS-REGIONAL SIGNALS</h2>
<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">The Wigwe disclosure is not an isolated Nigerian story — it is a signal of a global regulatory tide that is reshaping how African, Caribbean, and Middle Eastern wealth interfaces with Western property markets. The UK's beneficial ownership reforms mirror similar moves in the European Union, where AMLD5 and AMLD6 have progressively tightened disclosure requirements for property held through corporate structures across member states.</p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">For Caribbean diaspora investors, this trend carries particular resonance. Many Caribbean-origin investors in the UK and Europe have historically used similar offshore structures — often routed through Crown Dependencies like Jersey, Guernsey, or the Isle of Man — to hold London property. In jurisdictions like Barbados and Trinidad and Tobago, there is growing government interest in reciprocal transparency frameworks.</p>

<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;">The smart money is already moving toward direct ownership structures, family office vehicles with full beneficial ownership disclosure, and markets — such as select West African capitals and secondary Caribbean islands — where transparency regimes remain less developed but where underlying asset growth potential is strong.</p>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>

<h2 style="color:#1a1a2e;font-family:Georgia,serif;font-size:22px;margin-top:32px;">🔑 KEY TAKEAWAYS</h2>
<ul style="padding-left:20px;margin:12px 0;">
  <li style="margin-bottom:6px;line-height:1.7;"><strong style="color:#1a1a2e;">Transparency as a Structural Inflection Point:</strong> The UK's Register of Overseas Entities has fundamentally changed the rules of engagement for offshore property ownership in London. With 32,000+ properties now under scrutiny and 2,224 traced to Jersey alone, the era of anonymous offshore real estate holding in Britain is effectively over.</li>
  <li style="margin-bottom:6px;line-height:1.7;"><strong style="color:#1a1a2e;">Pricing Signal — Portfolio Liquidation Risk:</strong> If offshore owners choose to sell rather than disclose, prime London could see an unusual supply increase in high-value properties over the next 12–24 months. Diaspora investors with direct ownership structures may find themselves with rare access to previously locked assets.</li>
  <li style="margin-bottom:6px;line-height:1.7;"><strong style="color:#1a1a2e;">Compliance Angle — Act Now on Overseas Entity Registration:</strong> Any diaspora investor holding London property through a foreign company — whether registered in Jersey, BVI, or elsewhere — must ensure their beneficial ownership information is filed with the UK's ROE or face potential criminal penalties.</li>
  <li style="margin-bottom:6px;line-height:1.7;"><strong style="color:#1a1a2e;">Diaspora Pipeline — Succession Planning is Non-Negotiable:</strong> The ongoing Lagos court dispute over Wigwe's estate underscores the compounding legal complexity that arises when large, multi-jurisdictional property portfolios are left without airtight succession planning.</li>
  <li style="margin-bottom:6px;line-height:1.7;"><strong style="color:#1a1a2e;">Forward-Looking Risk — Regulatory Contagion Beyond the UK:</strong> EU member states, and potentially select African jurisdictions, are moving toward similar beneficial ownership registers. Investors who restructure now will be better positioned as this regulatory wave reaches additional markets over the next two to five years.</li>
</ul>

<hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;"/>
<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;"><em>Property Intelligence publishes weekly, delivering on-the-ground analysis for diaspora investors across Africa, Europe, the Caribbean, and Brazil. For editorial inquiries or partnership opportunities, contact the editorial team directly.</em></p>
<p style="line-height:1.8;color:#333;font-size:15px;margin:12px 0;"><em>© 2026 Property Intelligence. All rights reserved.</em></p>
`.trim();

export async function GET() {
  const existing = await getAll();
  if (existing.some((n) => n.wp_title === SAMPLE_TITLE)) {
    return NextResponse.json({ message: "Sample already exists.", count: existing.length });
  }

  const added = await addNewsletters([{
    wp_title: SAMPLE_TITLE,
    wp_body: SAMPLE_BODY,
    ad_leaderboard: true,
    ad_medium_rect: true,
    ad_native: true,
    ad_half_page: true,
  }]);

  return NextResponse.json({ message: "Sample newsletter seeded.", id: added[0].id });
}
