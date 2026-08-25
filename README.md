# SuMoS Benchmarking Tool monorepo

## 1. Environment Konfiguracija

Sve varijable potrebne za rad sistema mapirane su iz korenskog `.env` fajla. Kompletan šablon sa predefinisanim ključevima nalazi se u root direktorijumu kao:
* `/.env-example`

### Ključne env varijable:
* **`MONGO_URI`**: Targetira bazu pod nazivom `anketa-db` na internom hostu `sumos-mongo` (npr. `mongodb://sumos-mongo:27017/anketa-db`).
* **`VITE_API_URL`**: Klijent (React) koristi ovu varijablu za komunikaciju sa API-jem. Pošto se kod izvršava u browseru klijenta, ova vrednost mora da reflektuje spoljnu adresu API-ja (podrazumevano `http://localhost:3000`), a ne internu Docker mrežu.
* Standardni environment portovi koji su korišćeni u dev fazi su `8080` za klijentsku aplikaciju `3000` za API, `27017` za Mongo i `587` za SMTP host.
* Varijabla **MAIL_FROM** identifikuje pošiljaoca (U dev fazi koristili: SuMoS Benchmarking Tool <sumosbenchmarkingtool@gmail.com>)

---

## 2. Sloj Baze Podataka (MongoDB: `anketa-db`)

Aplikacija inicijalizuje i koristi bazu podataka pod nazivom **`anketa-db`**. Unutar ove baze, NestJS Mongoose sloj striktno mapira tri ključne kolekcije:

1.  **`questions`**: Sadrži strukturu ankete, metriku, definicije pitanja i Likert/Rubric matrice indikatora za benchmarking.
2.  **`submissions`**: Sadrži sirove odgovore korisnika koji pristižu sa klijentske forme.
3.  **`results`**: Sadrži obrađene i izračunate benchmark rezultate (skorove po domenima, statističke podatke) koji se generišu nakon evaluacije podnetih anketa.

---

## 3. Životni Ciklus Podataka i Automatski Seeding (`seed.service.ts`)

Aplikacija poseduje ugrađeni mehanizam za inicijalizaciju početnog stanja i predefinisanih anketnih pitanja, lociran u:
* `./api/src/seed/seed.service.ts`

### Mehanizam rada:
* **Automatsko okidanje**: Prilikom **prvog pokretanja NestJS API kontejnera**, `seed.service` presreće proces inicijalizacije modula (`onModuleInit`).
* **Provera stanja**: Servis proverava da li je kolekcija `questions` prazna.
* **Seeding**: Ako je baza čista, servis automatski parsira i upisuje predefinisani set benchmarking pitanja i evaluacionih rubrika direktno u kolekciju, čime se osigurava da je aplikacija odmah spremna za rad bez potrebe za ručnim uvozom skripti ili JSON fajlova. Ako podaci već postoje, seed proces se bezbedno preskače.

---

## 4. Specifičnosti Aplikativnih Slojeva

### API Backend (NestJS)
* **CORS i Origin**: Izvučen je kroz `FRONT_CORS` varijablu. NestJS je konfigurisan da sluša na interfejsu `0.0.0.0`, što omogućava Docker mrežnom Bridge-u da propusti zahteve spolja ka portu `3000`.
* **Email Servis**: Koristi se `MailerModule` integrisan sa SMTP parametrima iz `.env` fajla za slanje automatskih benchmark izveštaja korisnicima odmah nakon evaluacije.

### Klijent (Vite + React)
* **nginx**: Pokreće se sa `"-g", "daemon off;"` flegom unutar kontejnera. Port 5173 (paralelno korišćen Vite u dev-u) je interno zaključan unutar kontejnera, dok se preko Docker Compose mapira na spoljni port definisan u `CLIENT_PORT` (podrazumevano `8080`).
