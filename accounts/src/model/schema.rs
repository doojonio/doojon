table! {
    accounts (id) {
        id -> Uuid,
        email -> Text,
        password -> Text,
        first_name -> Nullable<Text>,
        last_name -> Nullable<Text>,
        birthday -> Nullable<Date>,
    }
}
