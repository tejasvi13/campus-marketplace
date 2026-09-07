import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import Field from "../components/Field.tsx";
import Notice from "../components/Notice.tsx";
import ListingCard from "../components/ListingCard.tsx";
import Empty from "../components/Empty.tsx";
import { getMyProfile, updateMyProfile } from "../api/users.ts";
import { myListings } from "../api/listings.ts";
import type { Listing, Profile, ProfileEdit, User } from "../types.ts";

interface ProfilePageProps {
  user: User;
  onProfileSaved: (user: User) => void;
}

const emptyEdit: ProfileEdit = {
  name: "",
  department: "",
  year: "",
  phone: "",
  hostel: "",
  about: "",
};

export default function ProfilePage({ user, onProfileSaved }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [form, setForm] = useState<ProfileEdit>(emptyEdit);
  const [error, setError] = useState<string>("");
  const [saved, setSaved] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data.profile);
        setForm({
          name: data.profile.name,
          department: data.profile.department,
          year: data.profile.year,
          phone: data.profile.phone,
          hostel: data.profile.hostel,
          about: data.profile.about,
        });
      })
      .catch((failure: unknown) => {
        setError(failure instanceof Error ? failure.message : "Could not load your profile.");
      });

    myListings()
      .then((data) => setListings(data.listings))
      .catch(() => {
      });
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError("");
    setSaved("");
    setBusy(true);

    try {
      const data = await updateMyProfile(form);
      setProfile(data.profile);
      setEditing(false);
      setSaved(data.message || "Profile saved.");

      onProfileSaved({
        id: data.profile.id,
        name: data.profile.name,
        regNo: data.profile.regNo,
        email: data.profile.email,
        department: data.profile.department,
        isVerified: data.profile.isVerified,
      });
    } catch (failure: unknown) {
      setError(failure instanceof Error ? failure.message : "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  }

  if (!profile) {
    return (
      <div className="page">
        <Notice tone="error">{error}</Notice>
        {!error ? <p className="loading">Loading your profile…</p> : null}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__head">
        <h1 className="page-title">Your profile</h1>
        <p className="page-sub">
          Other students see your name, department and e-mail when they open one of
          your listings.
        </p>
      </div>

      <Notice tone="good">{saved}</Notice>
      <Notice tone="error">{error}</Notice>

      <section className="panel">
        {editing ? (
          <form className="form" onSubmit={handleSave}>
            <Field label="Full name" name="name" value={form.name} onChange={handleChange} />

            <div className="row">
              <Field
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Computer Science"
              />
              <Field
                label="Year"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder="Second year"
              />
            </div>

            <div className="row">
              <Field
                label="Hostel and room"
                name="hostel"
                value={form.hostel}
                onChange={handleChange}
                placeholder="Block C, room 214"
              />
              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="about">
                About you
              </label>
              <textarea
                className="field__input field__input--area"
                id="about"
                name="about"
                rows={3}
                value={form.about}
                onChange={handleChange}
                placeholder="When you are usually free, what you are clearing out"
              />
            </div>

            <div className="buttonrow">
              <button className="button" type="submit" disabled={busy}>
                {busy ? "Saving\u2026" : "Save changes"}
              </button>
              <button
                type="button"
                className="button button--quiet"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="panel__head">
              <div>
                <h2 className="panel__title">{profile.name}</h2>
                <p className="panel__sub">{profile.email}</p>
              </div>
              <button type="button" className="button button--quiet" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            </div>

            <dl className="detail-list">
              <div className="detail-list__row">
                <dt>Register number</dt>
                <dd>{profile.regNo}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Department</dt>
                <dd>{profile.department || "Not filled in"}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Year</dt>
                <dd>{profile.year || "Not filled in"}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Hostel</dt>
                <dd>{profile.hostel || "Not filled in"}</dd>
              </div>
              <div className="detail-list__row">
                <dt>Phone</dt>
                <dd>{profile.phone || "Not filled in"}</dd>
              </div>
              <div className="detail-list__row">
                <dt>College e-mail</dt>
                <dd>Verified</dd>
              </div>
            </dl>

            {profile.about ? <p className="panel__about">{profile.about}</p> : null}
          </>
        )}
      </section>

      <section className="section" id="listings">
        <div className="section__head">
          <h2 className="section__title">Your listings</h2>
          <Link className="button" to="/listings/new">
            Post an item
          </Link>
        </div>

        {listings.length === 0 ? (
          <Empty title="You have not posted anything yet.">
            <p>
              Anything you are not using this semester is worth putting up. Somebody on
              campus is looking for it.
            </p>
          </Empty>
        ) : (
          <div className="grid">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section__title">Previous transactions</h2>
        <Empty title="Nothing here yet.">
          <p>
            Buying, renting and borrowing get recorded once Module 5 is built. Until
            then this stays empty.
          </p>
        </Empty>
      </section>
    </div>
  );
}
