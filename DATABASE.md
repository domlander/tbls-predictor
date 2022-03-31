# Custom database scripts

## Create log_prediction_changes function

This function will create a row in the predictions_log table.

Create new procedure/function in PostgreSQL:

- name: log_prediction_changes
- type: function
- language: plpgsql
- return type: trigger

```
$$
CREATE OR REPLACE FUNCTION public.log_prediction_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
	IF (new.home_goals <> old.home_goals) or (new.away_goals <> old.away_goals) or (new.big_boy_bonus <> old.big_boy_bonus) then
	insert into prediction_log
		("userId", "fixtureId", "oldHomeGoals", "oldAwayGoals", "newHomeGoals", "newAwayGoals",
		"oldBigBoyBonus", "newBigBoyBonus", created_at)
	values
	    (old.user_id, old.fixture_id, old.home_goals, old.away_goals, new.home_goals, new.away_goals,
	    old.big_boy_bonus, new.big_boy_bonus, now());

	elsif (OLD is null) then
	insert into prediction_log
		("userId", "fixtureId", "oldHomeGoals", "oldAwayGoals", "newHomeGoals", "newAwayGoals",
		"oldBigBoyBonus", "newBigBoyBonus", created_at)
	values
	    (new.user_id, new.fixture_id, null, null, new.home_goals, new.away_goals,
	    null, new.big_boy_bonus, now());
	end if;

	return new;
END;
$function$
;
```

## Create audit_predictions trigger

Create a trigger on the predictions table to run the log_prediction_changes function whenever there is an INSERT or UPDATE on this table.

Run this script:

```
create trigger audit_predictions before
insert or update
    on
    public.predictions for each row execute function log_prediction_changes()
```
