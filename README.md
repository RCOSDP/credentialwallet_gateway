## OpenBadge VC Converter

<img width="1426" alt="Screen Shot 2022-01-31 at 18 33 13" src="https://user-images.githubusercontent.com/38043569/151775976-e1735379-23b3-4366-b0bf-28b4c54f8343.png">

### Issue

<img width="1322" alt="Screen Shot 2022-01-31 at 18 36 31" src="https://user-images.githubusercontent.com/38043569/151776136-74c92039-c394-4c03-aaa5-4a1f59461713.png">

### Verify

<img width="1440" alt="Screen Shot 2022-01-31 at 19 18 11" src="https://user-images.githubusercontent.com/38043569/151776195-388a0cb5-ef80-49ac-8ebb-a5ac9307f970.png">

### Issued VC contains OpenBadge

<img width="767" alt="Screen Shot 2022-01-31 at 19 24 05" src="https://user-images.githubusercontent.com/38043569/151777055-f2550f62-4275-4e16-84c0-afa67a9343c1.png">

## DEMO

https://openbadge-vc-converter.vercel.app/

## Development

```
yarn
yarn dev
```

- make branch, make pull-request, make peer review, then merge.
- when you find bug or issue, make issue

## Note

### OpenBadge Verification

- using following API for the OpenBadge verification
  - https://openbadgesvalidator.imsglobal.org/results
- Check following document for the detail
  - https://github.com/IMSGlobal/openbadges-validator-core

* Currently above API is not stable, so for the better demo, the verification code is comment outed.
* Currently dynamic VC definition does not work and only accepts following Open Badges,
  - [IDPro](https://idpro.org/)
  - [Project Management Professional](https://www.pmi.org/)
