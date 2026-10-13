import React from 'react'

export const Second = () => {
  return (
  <main className="mainsec">
    <div className="containersec">
      <div className="tablesec">
        <h1 className="texttisec">Anmeldeformular</h1>
            <input className="inputfielsec" placeholder="Vorname" />
            <input className="inputfielsec" placeholder="Nachname" />
            <input className="inputfielsec" placeholder="Adresse" />
            <input className="inputfielsec" placeholder="PLZ" />
            <input className="inputfielsec" placeholder="E-Mail" />
            <input className="inputfielsec" type="date" />
            <button type='button' className="buttonsec">Absenden</button>
    </div>
  </div>
</main>
  )
}
