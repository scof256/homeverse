"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [["Home", "#home"], ["About", "#about"], ["Service", "#service"], ["Property", "/properties"], ["Blog", "#blog"], ["Contact", "#contact"]];

const services = [
  ["Buy a home", "/assets/images/service-1.png"],
  ["Rent a home", "/assets/images/service-2.png"],
  ["Sell a home", "/assets/images/service-3.png"],
];

const properties = [
  ["New Apartment Nice View", "/assets/images/property-1.jpg", "For Rent", "green", "new-apartment-nice-view", "$2,400", "/Month"],
  ["Modern Apartments", "/assets/images/property-2.jpg", "For Sale", "orange", "modern-city-apartments", "$349,000", ""],
  ["Comfortable Apartment", "/assets/images/property-3.jpg", "For Rent", "green", "comfortable-family-apartment", "$1,950", "/Month"],
  ["Luxury villa in Rego Park", "/assets/images/property-4.png", "For Sale", "orange", "rego-park-luxury-villa", "$875,000", ""],
];

const amenities = [
  ["car-sport-outline", "Parking Space"],
  ["water-outline", "Swimming Pool"],
  ["shield-checkmark-outline", "Private Security"],
  ["fitness-outline", "Medical Center"],
  ["library-outline", "Library Area"],
  ["bed-outline", "King Size Beds"],
  ["home-outline", "Smart Homes"],
  ["football-outline", "Kid’s Playland"],
];

const posts = [
  ["The Most Inspiring Interior Design Of 2021", "/assets/images/blog-1.png", "Interior"],
  ["Recent Commercial Real Estate Transactions", "/assets/images/blog-2.jpg", "Estate"],
  ["Renovating a Living Room? Experts Share Their Secrets", "/assets/images/blog-3.jpg", "Room"],
];

function Icon({ name }) {
  const iconUrl = `url(/assets/icons/${name}.svg)`;
  return <ion-icon aria-hidden="true" style={{ WebkitMaskImage: iconUrl, maskImage: iconUrl }} />;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header${scrolled ? " active" : ""}`}>
      <button className={`overlay${menuOpen ? " active" : ""}`} onClick={closeMenu} aria-label="Close menu overlay" />

      <div className="header-top">
        <div className="container">
          <ul className="header-top-list">
            <li><a href="mailto:info@homeverse.com" className="header-top-link"><Icon name="mail-outline" /><span>info@homeverse.com</span></a></li>
            <li><a href="#contact" className="header-top-link"><Icon name="location-outline" /><address>15/A, Nest Tower, NYC</address></a></li>
          </ul>
          <div className="wrapper">
            <ul className="header-top-social-list">
              {["logo-facebook", "logo-twitter", "logo-instagram", "logo-pinterest"].map((icon) => (
                <li key={icon}><a href="#contact" className="header-top-social-link" aria-label={icon.replace("logo-", "")}><Icon name={icon} /></a></li>
              ))}
            </ul>
            <a className="header-top-btn" href="/dashboard/listings/new">Add Listing</a>
          </div>
        </div>
      </div>

      <div className="header-bottom">
        <div className="container">
          <a href="#home" className="logo" aria-label="Homeverse home"><Image src="/assets/images/logo.png" width={230} height={34} alt="Homeverse logo" priority /></a>
          <nav className={`navbar${menuOpen ? " active" : ""}`} aria-label="Main navigation">
            <div className="navbar-top">
              <a href="#home" className="logo" onClick={closeMenu}><Image src="/assets/images/logo.png" width={230} height={34} alt="Homeverse logo" /></a>
              <button className="nav-close-btn" onClick={closeMenu} aria-label="Close Menu"><Icon name="close-outline" /></button>
            </div>
            <div className="navbar-bottom">
              <ul className="navbar-list">
                {navItems.map(([label, href]) => <li key={label}><a href={href} className="navbar-link" onClick={closeMenu}>{label}</a></li>)}
              </ul>
            </div>
          </nav>
          <div className="header-bottom-actions">
            {[["search-outline", "Search", "/properties"], ["person-outline", "Profile", "/dashboard"], ["heart-outline", "Saved", "/dashboard/favorites"]].map(([icon, label, href]) => (
              <a href={href} className="header-bottom-actions-btn" aria-label={label} key={label}><Icon name={icon} /><span>{label}</span></a>
            ))}
            <button className="header-bottom-actions-btn" onClick={() => setMenuOpen(true)} aria-label="Open Menu"><Icon name="menu-outline" /><span>Menu</span></button>
          </div>
        </div>
      </div>
    </header>
  );
}

function PropertyCard({ property }) {
  const [title, image, badge, color, slug, price, suffix] = property;
  return (
    <div className="property-card">
      <figure className="card-banner">
        <a href={`/properties/${slug}`}><Image src={image} width={850} height={650} alt={title} className="w-100" loading="eager" /></a>
        <div className={`card-badge ${color}`}>{badge}</div>
        <div className="banner-actions">
          <button className="banner-actions-btn"><Icon name="location" /><address>Belmont Gardens, Chicago</address></button>
          <button className="banner-actions-btn" aria-label="4 photos"><Icon name="camera" /><span>4</span></button>
          <button className="banner-actions-btn" aria-label="2 videos"><Icon name="film" /><span>2</span></button>
        </div>
      </figure>
      <div className="card-content">
        <div className="card-price"><strong>{price}</strong>{suffix}</div>
        <h3 className="h3 card-title"><a href={`/properties/${slug}`}>{title}</a></h3>
        <p className="card-text">A carefully selected home with practical space, trusted listing details and direct agent support.</p>
        <ul className="card-list">
          <li className="card-item"><strong>3</strong><Icon name="bed-outline" /><span>Bedrooms</span></li>
          <li className="card-item"><strong>2</strong><Icon name="man-outline" /><span>Bathrooms</span></li>
          <li className="card-item"><strong>3450</strong><Icon name="square-outline" /><span>Square Ft</span></li>
        </ul>
      </div>
      <div className="card-footer">
        <div className="card-author">
          <figure className="author-avatar"><Image src="/assets/images/author.jpg" width={200} height={200} alt="William Seklo" className="w-100" loading="eager" /></figure>
          <div><p className="author-name"><a href="#contact">William Seklo</a></p><p className="author-title">Estate Agents</p></div>
        </div>
        <div className="card-footer-actions">
          <button className="card-footer-actions-btn" aria-label="Resize"><Icon name="resize-outline" /></button>
          <button className="card-footer-actions-btn" aria-label="Save property"><Icon name="heart-outline" /></button>
          <button className="card-footer-actions-btn" aria-label="Add property"><Icon name="add-circle-outline" /></button>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ post }) {
  const [title, image, category] = post;
  return (
    <div className="blog-card">
      <figure className="card-banner"><Image src={image} width={854} height={614} alt={title} className="w-100" loading="eager" /></figure>
      <div className="blog-content">
        <div className="blog-content-top">
          <ul className="card-meta-list">
            <li><a href="#contact" className="card-meta-link"><Icon name="person" /><span>by: Admin</span></a></li>
            <li><a href="#blog" className="card-meta-link"><Icon name="pricetags" /><span>{category}</span></a></li>
          </ul>
          <h3 className="h3 blog-title"><a href="#contact">{title}</a></h3>
        </div>
        <div className="blog-content-bottom">
          <div className="publish-date"><Icon name="calendar" /><time dateTime="2022-04-27">Apr 27, 2022</time></div>
          <a href="#contact" className="read-more-btn">Read More</a>
        </div>
      </div>
    </div>
  );
}

export default function Homeverse() {
  return (
    <>
      <Header />
      <main>
        <article>
          <section className="hero" id="home">
            <div className="container">
              <div className="hero-content">
                <p className="hero-subtitle"><Icon name="home" /><span>Real Estate Agency</span></p>
                <h1 className="h1 hero-title">Find Your Dream House By Us</h1>
                <p className="hero-text">Search verified homes, compare the details that matter, and move from shortlist to viewing with a trusted local agent.</p>
                <a className="btn" href="/properties">Explore Properties</a>
              </div>
              <figure className="hero-banner"><Image src="/assets/images/hero-banner.png" width={717} height={541} alt="Modern house model" className="w-100" priority /></figure>
            </div>
          </section>

          <section className="about" id="about">
            <div className="container">
              <figure className="about-banner">
                <Image src="/assets/images/about-banner-1.png" width={574} height={722} alt="House interior" />
                <Image src="/assets/images/about-banner-2.jpg" width={800} height={570} alt="House interior" className="abs-img" />
              </figure>
              <div className="about-content">
                <p className="section-subtitle">About Us</p>
                <h2 className="h2 section-title">The Leading Real Estate Rental Marketplace.</h2>
                <p className="about-text">Homeverse brings renters, buyers and trusted property professionals together in one clear, accountable marketplace.</p>
                <ul className="about-list">
                  {[["home-outline", "Smart Home Design"], ["leaf-outline", "Beautiful Scene Around"], ["wine-outline", "Exceptional Lifestyle"], ["shield-checkmark-outline", "Complete 24/7 Security"]].map(([icon, text]) => (
                    <li className="about-item" key={text}><div className="about-item-icon"><Icon name={icon} /></div><p className="about-item-text">{text}</p></li>
                  ))}
                </ul>
                <p className="callout">&quot;A better property decision starts with accurate information, responsive agents and a process you can follow.&quot;</p>
                <a href="#service" className="btn">Our Services</a>
              </div>
            </div>
          </section>

          <section className="service" id="service">
            <div className="container">
              <p className="section-subtitle">Our Services</p>
              <h2 className="h2 section-title">Our Main Focus</h2>
              <ul className="service-list">
                {services.map(([title, image]) => (
                  <li key={title}><div className="service-card">
                    <div className="card-icon"><Image src={image} width={185} height={140} alt="Service icon" loading="eager" /></div>
                    <h3 className="h3 card-title"><a href="#property">{title}</a></h3>
                    <p className="card-text">over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.</p>
                    <a href="#property" className="card-link"><span>Find A Home</span><Icon name="arrow-forward-outline" /></a>
                  </div></li>
                ))}
              </ul>
            </div>
          </section>

          <section className="property" id="property">
            <div className="container">
              <p className="section-subtitle">Properties</p>
              <h2 className="h2 section-title">Featured Listings</h2>
              <ul className="property-list has-scrollbar">{properties.map((property) => <li key={property[0]}><PropertyCard property={property} /></li>)}</ul>
            </div>
          </section>

          <section className="features">
            <div className="container">
              <p className="section-subtitle">Our Aminities</p>
              <h2 className="h2 section-title">Building Aminities</h2>
              <ul className="features-list">
                {amenities.map(([icon, title]) => <li key={title}><a href="#contact" className="features-card"><div className="card-icon"><Icon name={icon} /></div><h3 className="card-title">{title}</h3><div className="card-btn"><Icon name="arrow-forward-outline" /></div></a></li>)}
              </ul>
            </div>
          </section>

          <section className="blog" id="blog">
            <div className="container">
              <p className="section-subtitle">News &amp; Blogs</p>
              <h2 className="h2 section-title">Leatest News Feeds</h2>
              <ul className="blog-list has-scrollbar">{posts.map((post) => <li key={post[0]}><BlogCard post={post} /></li>)}</ul>
            </div>
          </section>

          <section className="cta"><div className="container"><div className="cta-card">
            <div className="card-content"><h2 className="h2 card-title">Looking for a dream home?</h2><p className="card-text">We can help you realize your dream of a new home</p></div>
            <a className="btn cta-btn" href="#property"><span>Explore Properties</span><Icon name="arrow-forward-outline" /></a>
          </div></div></section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  const columns = [
    ["Company", "About", "Blog", "All Products", "Locations Map", "FAQ", "Contact us"],
    ["Services", "Order tracking", "Wish List", "Login", "My account", "Terms & Conditions", "Promotional Offers"],
    ["Customer Care", "Login", "My account", "Wish List", "Order tracking", "FAQ", "Contact us"],
  ];
  return (
    <footer className="footer" id="contact">
      <div className="footer-top"><div className="container">
        <div className="footer-brand">
          <a href="#home" className="logo"><Image src="/assets/images/logo-light.png" width={230} height={34} alt="Homeverse logo" loading="eager" /></a>
          <p className="section-text">A modern property marketplace for finding homes, scheduling viewings, managing listings and building trusted customer relationships.</p>
          <ul className="contact-list">
            <li><a href="#contact" className="contact-link"><Icon name="location-outline" /><address>Brooklyn, New York, United States</address></a></li>
            <li><a href="tel:+0123456789" className="contact-link"><Icon name="call-outline" /><span>+0123-456789</span></a></li>
            <li><a href="mailto:contact@homeverse.com" className="contact-link"><Icon name="mail-outline" /><span>contact@homeverse.com</span></a></li>
          </ul>
          <ul className="social-list">{["logo-facebook", "logo-twitter", "logo-linkedin", "logo-youtube"].map((icon) => <li key={icon}><a href="#contact" className="social-link" aria-label={icon.replace("logo-", "")}><Icon name={icon} /></a></li>)}</ul>
        </div>
        <div className="footer-link-box">
          {columns.map(([title, ...links]) => <ul className="footer-list" key={title}><li><p className="footer-list-title">{title}</p></li>{links.map((link) => <li key={link}><a href="#home" className="footer-link">{link}</a></li>)}</ul>)}
        </div>
      </div></div>
      <div className="footer-bottom"><div className="container"><p className="copyright">&copy; 2022 <a href="#home">codewithsadee</a>. All Rights Reserved</p></div></div>
    </footer>
  );
}
