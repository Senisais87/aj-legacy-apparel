export const designs=[
  {
    "id": "blank",
    "name": "AJ essentials \u00b7 no graphic",
    "line": "Any",
    "asset": null,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-law-scripture",
    "name": "Peacemakers Scripture Tee",
    "line": "Service",
    "asset": "assets/concepts/law-scripture.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit",
      "State",
      "Abbreviation",
      "ThinLine"
    ]
  },
  {
    "id": "concept-doc-scripture",
    "name": "Courage Scripture Tee",
    "line": "Service",
    "asset": "assets/concepts/doc-scripture.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit",
      "State",
      "Abbreviation",
      "ThinLine"
    ]
  },
  {
    "id": "concept-gym-renew",
    "name": "Renewed Strength Training Tee",
    "line": "Gym",
    "asset": "assets/concepts/gym-renew.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-gym-strength-hoodie",
    "name": "Strength Through Christ Hoodie",
    "line": "Gym",
    "asset": "assets/concepts/gym-strength-hoodie.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-memorial-until",
    "name": "Until Tomorrow Memorial Tee",
    "line": "Memorial",
    "asset": "assets/concepts/memorial-until.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-memorial-faith-hoodie",
    "name": "Walk by Faith Memorial Hoodie",
    "line": "Memorial",
    "asset": "assets/concepts/memorial-faith-hoodie.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-gym-earned",
    "name": "Earned Not Given Training Tee",
    "line": "Gym",
    "asset": "assets/concepts/gym-earned.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-gym-rep",
    "name": "One More Rep Training Tee",
    "line": "Gym",
    "asset": "assets/concepts/gym-rep.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-gym-discipline",
    "name": "Discipline Builds Strength Hoodie",
    "line": "Gym",
    "asset": "assets/concepts/gym-discipline.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-memorial-lift",
    "name": "Lift for a Legacy Event Tee",
    "line": "Memorial",
    "asset": "assets/concepts/memorial-lift.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-memorial-love",
    "name": "Love Lives On Memorial Tee",
    "line": "Memorial",
    "asset": "assets/concepts/memorial-love.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "concept-memorial-carry",
    "name": "Carry the Legacy Memorial Hoodie",
    "line": "Memorial",
    "asset": "assets/concepts/memorial-carry.webp",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "k1",
    "name": "Handler & Partner",
    "line": "K9",
    "asset": "assets/k9/handler-partner.webp",
    "containsDog": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit",
      "State",
      "Abbreviation",
      "Breed",
      "ThinLine"
    ]
  },
  {
    "id": "k2",
    "name": "Strength for Service",
    "line": "K9",
    "asset": "assets/k9/strength-for-service.webp",
    "containsDog": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit",
      "State",
      "Abbreviation",
      "Breed",
      "ThinLine"
    ]
  },
  {
    "id": "k3",
    "name": "Search & Protect",
    "line": "K9",
    "asset": "assets/k9/search-protect.webp",
    "containsDog": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit",
      "State",
      "Abbreviation",
      "Breed",
      "ThinLine"
    ]
  },
  {
    "id": "approved-eclipse-memorial",
    "name": "Forever in Your Shadow",
    "line": "Memorial",
    "asset": "memorial-images/eclipse-memorial-tee.jpg",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  },
  {
    "id": "approved-event-2027",
    "name": "Legacy of Strength 2027",
    "line": "Memorial",
    "asset": "assets/events/legacy-strength-2027.png",
    "referenceOnly": true,
    "capabilities": [
      "Name",
      "Rank",
      "Unit"
    ]
  }
,
{"id": "shirt2_0-law", "name": "Law Enforcement \u2014 Matthew 5:9", "line": "Service", "asset": "assets/matthew-law.svg", "referenceOnly": true, "capabilities": ["Name", "Rank", "Unit", "State", "Abbreviation", "ThinLine"]},
{"id": "shirt2_0-doc", "name": "DOC / TRT \u2014 Matthew 5:9", "line": "Service", "asset": "assets/matthew-doc.svg", "referenceOnly": true, "capabilities": ["Name", "Rank", "Unit", "State", "Abbreviation", "ThinLine"]}];
export const designById=id=>designs.find(d=>d.id===id)||designs[0];
