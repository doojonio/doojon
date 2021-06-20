table! {
    accounts (id) {
        id -> Uuid,
        email -> Text,
        password -> Text,
        first_name -> Nullable<Text>,
        last_name -> Nullable<Text>,
        birthday -> Nullable<Date>,
        create_time -> Timestamptz,
        update_time -> Timestamptz,
    }
}

table! {
    sessions (id) {
        id -> Uuid,
        account_id -> Uuid,
        create_time -> Timestamptz,
    }
}

joinable!(sessions -> accounts (account_id));

allow_tables_to_appear_in_same_query!(
    accounts,
    sessions,
);
