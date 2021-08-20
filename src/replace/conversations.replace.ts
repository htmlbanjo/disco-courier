export const normalizedNames = <TKeyOutputFunction>(name: string): string => {
  if (name) {
    // normalizes first two entries which are different from all others.
    name = name.replace(
      /DOOMED \/ DOOR \/ DOOMED EXIT/,
      'DOOMED F1 / DOOMED EXIT DOOR'
    )
    name = name.replace(
      /WATERFRONT \/ DOOR \/ BALCONY/,
      'WHIRLING F2 / BALCONY DOOR'
    )

    // these are barks, not doors.
    name = name.replace(/LAIR \/ KIM DOOR barks/, 'LAIR / KIM door barks')
    name = name.replace(
      /LAIR \/ KIM APT DOOR barks/,
      'LAIR / KIM APT door barks'
    )

    // improves searches and tokenization for FELD
    name = name.replace(/COAST ORB \/ feldwindows/, 'COAST ORB / FELD Windows')
    name = name.replace(/COAST ORB \/ dizzyingheights/, 'COAST ORB / FELD ROOF')
    name = name.replace(
      /COAST ORB \/ feldwindowsbars/,
      'COAST ORB / FELD Window Bars'
    )

    // removes trailing 'orb' to reduce misleading tokens
    name = name.replace(
      /COAST ORB \/ feldwindowsgreenorb/,
      'COAST ORB / FELD Windows'
    )
    name = name.replace(/BOOKSTORE ORB \/ windoworb/, 'BOOKSTORE ORB / Window')
    name = name.replace(
      /BOOKSTORE ORB \/ balconyorb/,
      'BOOKSTORE ORB / Balcony'
    )
    name = name.replace(/BOOKSTORE ORB \/ stufforb/, 'BOOKSTORE ORB / Stuff')
    name = name.replace(/BOOKSTORE ORB \/ shelforb/, 'BOOKSTORE ORB / Shelf')
    name = name.replace(/COAST ORB \/ bluedoororb/, 'COAST ORB / Blue door')

    // normalize poor orb reference
    name = name.replace(/WHIRLING F2 \/ note orb/, 'WHIRLING F2 / Note ORB')
    name = name.replace(
      /WHIRLING F1 \/ orb communist quest/,
      'WHIRLING F1 ORB / communist'
    )
    name = name.replace(/ORB AFTERTHOUGHT/, 'AFTERTHOUGHT ORB')
    name = name.replace(
      /LANDS END \/ ladder afterthought/,
      'LANDS END ORB / ladder afterthought'
    )

    // normalize location/subject
    name = name.replace(/MEASUREHEAD \/ FASCHA DQ/, 'FASCHA_DQ / MEASUREHEAD')

    // add FLOOR designators for whirling where appropriate
    name = name.replace(
      /WHIRLING \/ MONEYMAN barks/,
      'WHIRLING F1 / MONEYMAN barks'
    )
    name = name.replace(
      /WHIRLING \/ SLEEPING DOCKWORKER/,
      'WHIRLING F1 / SLEEPING DOCKWORKER'
    )
    name = name.replace(/WHIRLING \/ LENA INTRO/, 'WHIRLING F1 / LENA INTRO')
    name = name.replace(/WHIRLING \/ LENA MAIN/, 'WHIRLING F1 / LENA MAIN')
    name = name.replace(
      /WHIRLING \/ LENA CRYPTIDS CHECK/,
      'WHIRLING F1 / LENA CRYPTIDS CHECK'
    )
    name = name.replace(
      /WHIRLING \/ LENA DAY 2 BARKS/,
      'WHIRLING F1 / LENA DAY 2 BARKS'
    )
    name = name.replace(/WHIRLING \/ KIM INTRO/, 'WHIRLING F1 / KIM INTRO')
    // also fixes only dream without a space between identifier and number
    name = name.replace(/WHIRLING \/ DREAM1/, 'WHIRLING F2 / DREAM 1')
    name = name.replace(/WHIRLING \/ CEILING FAN/, 'WHIRLING F2 / CEILING FAN')
    name = name.replace(
      /WHIRLING \/ BATHROOM MIRROR/,
      'WHIRLING F2 / BATHROOM MIRROR'
    )
    name = name.replace(
      /WHIRLING \/ STAIRWAY \/ 2TO1/,
      'WHIRLING / 2to1 STAIRWAY'
    )
    name = name.replace(/WHIRLING \/ BATHTUB/, 'WHIRLING F2 / BATHTUB')

    // Normalize two references where "SEAFORT DREAM" is "DREAM SEAFORT" and remove redundancy
    name = name.replace(
      /SEAFORT ORB\/ dream water/,
      'SEAFORT DREAM ORB / water'
    )
    name = name.replace(/DREAM SEAFORT/, 'SEAFORT DREAM')

    // Add FLOOR designators to DOOMED area where appropriate
    name = name.replace(
      /DOOMED \/ ELECTRONIC DOORBELL/,
      'DOOMED F1 / ELECTRONIC DOORBELL'
    )
    name = name.replace(
      /DOOMED \/ CENTRAL FURNACE/,
      'DOOMED S1 / CENTRAL FURNACE'
    )
    name = name.replace(/DOOMED \/ BREAKER BOX/, 'DOOMED S1 / BREAKER BOX')
    name = name.replace(
      /DOOMED \/ ICE CREAM MAKER/,
      'DOOMED S1 / ICE CREAM MAKER'
    )
    name = name.replace(
      /DOOMED \/ ICE BEAR FRIDGE/,
      'DOOMED S1 / ICE BEAR FRIDGE'
    )
    name = name.replace(
      /DOOMED \/ HIDDEN WEAPONS CACHE/,
      'DOOMED S1 / HIDDEN WEAPONS CACHE'
    )
    name = name.replace(/DOOMED \/ BARBELL/, 'DOOMED F1 / BARBELL')
    name = name.replace(/DOOMED \/ MOODBOARD/, 'DOOMED F2 / MOODBOARD')
    name = name.replace(/DOOMED \/ RADIOCOMPUTER/, 'DOOMED F2 / RADIOCOMPUTER')
    name = name.replace(/DOOMED \/ CURTAINS/, 'DOOMED F1 / CURTAINS')

    name = name.replace(
      /DOOMED \/ FREQUENCY FIREPLACE/,
      'DOOMED S1 / FREQUENCY FIREPLACE'
    )
    name = name.replace(/DOOMED \/ DICEMAKER/, 'DOOMED F2 / DICEMAKER')

    // forcing recognition for DOOR
    name = name.replace(
      /APT ORB \/ foreclosed apt door/,
      'APT ORB / foreclosed apt DOOR'
    )
    name = name.replace(/YARD \/ CUNODOOR/, 'YARD / CUNO SHACK DOOR')

    //OOF THIS ONE
    name = name.replace(
      /APT \/ smoker door orb/,
      'APT ORB / Smoker balcony DOOR'
    )

    // Fix for only locations with a space, so that floor names are easier to catch.
    name = name.replace(/LANDS END/, 'LANDS_END')
    name = name.replace(/GARYS APARTMENT/, 'GARYS_APARTMENT')
    name = name.replace(/FASCHA DQ/, 'FASCHA_DQ')
  }
  return name
}
