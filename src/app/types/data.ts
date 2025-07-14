export interface DataEntry {
  _id: any;
  id: string;
  tanggal_entry: string; // auto
  tanggal_form: string;
  tanggal_eskalasi: string;
  keterangan: string;
  sistem: string;
  code_user: string;
  user: string;
  penerima: string;
  atasan: string;
  keterangan_apps: string; // auto: keterangan + sistem
  keterangan_detail: string; // auto: keterangan + sistem + user
}
