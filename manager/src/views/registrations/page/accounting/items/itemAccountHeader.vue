<template>
    <li class="item-account-header grid" :class="classGrid">
        <span class="detail"></span>
        <input class="checkbox" type="checkbox" @change="$emit('select-all', $event.target.checked)">
        <item-column class="description" key_label="name" :sortPreferences="sortPreferences"  @event-sort-column="$emit('event-sort-column', $event)" >Descrição</item-column>
        <span class="frequency">Freq.</span>
        <item-column class="amount" key_label="amount" :sortPreferences="sortPreferences"  @event-sort-column="$emit('event-sort-column', $event)" >Valor</item-column>
        <item-column class="dates" key_label="due_date" :sortPreferences="sortPreferences"  @event-sort-column="$emit('event-sort-column', $event)" >{{ headerDateLabel }}</item-column>
        <span class="buttons">Ações</span>
    </li>
</template>

<script>
import itemColumn from "./itemColumnHeader.vue"

export default {
    components: { itemColumn },
    props: { classGrid: String, headerDateLabel: String, sortPreferences: Object },
}
</script>

<style lang="less" scoped>
    .grid{
        display: grid;
        grid-template-rows: auto;
        column-gap: 18px;
        padding-right: 20px;
    }
    // contas a pagar
    .forecast_accounts{ 
        grid-template-areas: "detail checkbox description frequency amount dates buttons";
        grid-template-columns: 4px 16px 400px 120px minmax(120px, min-content) 120px 1fr;

        .frequency, .buttons{
            display: flex;
        }
    }
    // contas pagas
    .realized_accounts{ 
        grid-template-areas: "detail checkbox description amount dates buttons";
        grid-template-columns: 4px 16px 400px minmax(120px, min-content) 120px 1fr;

        .frequency{
            display: none;
        }
    }
    .item-account-header{
        width: 100%;
        height: 50px;
        font-weight: bold;
        position: sticky;
        top: 0;
        left: 0;
        background-color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, .4);
        z-index: 1;
        overflow: hidden;
        span{
            font-size: 1.5em;
            padding: 0 4px;
            cursor: default;
            white-space: nowrap;

            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
        }
    }
    @media screen and (max-width: 400px){
        .grid{
            grid-template-areas: "detail checkbox description";
            grid-template-columns: 4px 16px 1fr;
            grid-template-rows: auto;

            .frequency,
            .amount,
            .status,
            .dates,
            .buttons{
                display: none;
            }
            
        }
    } 
    .detail{ grid-area: detail; }
    .checkbox{ grid-area: checkbox; padding: 0; }
    .description{ grid-area: description; }
    .frequency{ grid-area: frequency; }
    .amount{ grid-area: amount; }
    .status{ grid-area: status; }
    .dates{ grid-area: dates; }
    .buttons{ grid-area: buttons; justify-self: center; }
</style>