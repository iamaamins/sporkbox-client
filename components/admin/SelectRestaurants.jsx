import styles from "@styles/admin/SelectRestaurants.module.css";

export default function SelectRestaurants() {
  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <section className={styles.select_restaurants}>
      <h2>Select restaurants</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.item}>
          <label htmlFor="date">Select a date</label>
          <input type="date" id="date" />
        </div>

        <div className={styles.item}>
          <label htmlFor="restaurant">Select a restaurant</label>
          <select name="restaurant" id="restaurant">
            <option value="restaurant1">Restaurant 1</option>
            <option value="restaurant2">Restaurant 2</option>
            <option value="restaurant3">Restaurant 3</option>
            <option value="restaurant4">Restaurant 4</option>
          </select>
        </div>

        <button type="submit">Add restaurant</button>
      </form>
    </section>
  );
}
